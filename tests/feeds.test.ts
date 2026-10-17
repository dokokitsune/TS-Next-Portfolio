import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchGitHubProjects, fetchSteamGames, fetchSteamSchema, UpstreamError } from "../app/lib/feeds/sources";
import type { Fetcher } from "../app/lib/feeds/sources";

const config = { apiKey: "test-steam-key", steamId: "76561198000000000" };
const repo = { id: 123, name: "homelab", html_url: "https://github.com/example/homelab", language: "Nix", description: "My cluster", topics: ["kubernetes"], homepage: "https://example.com", stargazers_count: 12, forks_count: 2, license: { spdx_id: "MIT", name: "MIT License" }, archived: true, fork: false };
const commit = { sha: "abc123", commit: { message: "Deploy monitoring\n\nDetails", committer: { date: "2026-10-15T12:00:00Z" }, author: null } };

function mockFetch(handler: (url: URL, options?: RequestInit) => Response | Promise<Response>): Fetcher {
  return ((input: string | URL | Request, options?: RequestInit) => Promise.resolve(handler(new URL(String(input)), options))) as Fetcher;
}

test("GitHub combines metadata with one latest-commit request and keeps string IDs", async () => {
  const requests: URL[] = [];
  const data = await fetchGitHubProjects({ username: "example", token: "test-github-token" }, mockFetch((url, options) => {
    requests.push(url);
    assert.equal(new Headers(options?.headers).get("Authorization"), "Bearer test-github-token");
    if (url.pathname.endsWith("/commits")) {
      assert.equal(url.searchParams.get("per_page"), "1");
      return Response.json([commit]);
    }
    assert.equal(url.searchParams.get("per_page"), "12");
    return Response.json([repo]);
  }));
  assert.equal(requests.length, 2);
  assert.equal(data[0].id, "123");
  assert.equal(data[0].description, "My cluster");
  assert.deepEqual(data[0].topics, ["kubernetes"]);
  assert.equal(data[0].homepage, "https://example.com");
  assert.equal(data[0].stars, 12);
  assert.equal(data[0].forks, 2);
  assert.equal(data[0].license, "MIT");
  assert.equal(data[0].archived, true);
  assert.equal(data[0].isFork, false);
  assert.equal(data[0].latestCommit?.message, "Deploy monitoring");
  assert.equal(data[0].latestCommit?.date, "2026-10-15T12:00:00Z");
});

test("GitHub refreshes twelve repositories with no metadata requests beyond the list and latest commits", async () => {
  let requests = 0;
  let concurrent = 0;
  let maxConcurrent = 0;
  const data = await fetchGitHubProjects({ username: "example" }, mockFetch(async url => {
    requests++;
    if (!url.pathname.endsWith("/commits")) {
      return Response.json(Array.from({ length: 12 }, (_, i) => ({ ...repo, id: i, name: `repo-${i}` })));
    }
    concurrent++;
    maxConcurrent = Math.max(maxConcurrent, concurrent);
    await new Promise(resolve => setTimeout(resolve, 5));
    concurrent--;
    return Response.json([commit]);
  }));
  assert.equal(data.length, 12);
  assert.equal(requests, 13);
  assert.ok(maxConcurrent <= 3);
});

test("empty GitHub repositories remain visible without pretending to have a commit", async () => {
  const data = await fetchGitHubProjects({ username: "example" }, mockFetch(url => (
    url.pathname.endsWith("/commits") ? Response.json({}, { status: 409 }) : Response.json([repo])
  )));
  assert.equal(data.length, 1);
  assert.equal(data[0].latestCommit, null);
});

test("GitHub authorization failures reject instead of producing an empty successful snapshot", async () => {
  await assert.rejects(fetchGitHubProjects({ username: "example" }, mockFetch(() => Response.json({}, { status: 401 }))), UpstreamError);
});

test("a failed per-repository request rejects the entire refresh", async () => {
  await assert.rejects(fetchGitHubProjects({ username: "example" }, mockFetch(url => (
    url.pathname.endsWith("/commits") ? Response.json({}, { status: 503 }) : Response.json([repo])
  ))), UpstreamError);
});

test("malformed GitHub responses are not cached as successful empty results", async () => {
  await assert.rejects(fetchGitHubProjects({ username: "example" }, mockFetch(() => Response.json({ message: "unexpected" }))), UpstreamError);
});

test("a genuinely empty repository list is supported", async () => {
  assert.deepEqual(await fetchGitHubProjects({ username: "example" }, mockFetch(() => Response.json([]))), []);
});

const achievements = [
  { apiname: "old", achieved: 1, unlocktime: 10 },
  { apiname: "new", achieved: 1, unlocktime: 50 },
  { apiname: "locked", achieved: 0, unlocktime: 100 },
  { apiname: "middle", achieved: 1, unlocktime: 30 },
  { apiname: "recent", achieved: 1, unlocktime: 40 },
  { apiname: "no-date", achieved: 1, unlocktime: 0 },
];

const recent = { response: { total_count: 1, games: [{ appid: 42, name: "Example game", playtime_forever: 125, img_icon_url: "icon-hash" }] } };
function steamFetch(overrides: Record<string, Response> = {}): Fetcher {
  return mockFetch(url => {
    assert.equal(url.searchParams.get("key"), config.apiKey);
    const method = url.pathname.split("/")[2];
    if (overrides[method]) return overrides[method].clone();
    switch (method) {
      case "GetRecentlyPlayedGames": return Response.json(recent);
      case "GetSchemaForGame": return Response.json({ game: { availableGameStats: { achievements: achievements.map(a => ({ name: a.apiname, displayName: `${a.apiname} title`, icon: "https://steamcdn-a.akamaihd.net/icon.jpg" })) } } });
      case "GetPlayerAchievements": return Response.json({ playerstats: { success: true, achievements } });
      case "GetGlobalAchievementPercentagesForApp": return Response.json({ achievementpercentages: { achievements: [{ name: "new", percent: 12.5 }] } });
      default: throw new Error(`Unexpected method: ${method}`);
    }
  });
}

test("Steam joins achievement titles/icons/percentages and selects the latest three unlocked achievements", async () => {
  const [game] = await fetchSteamGames(config, steamFetch());
  assert.equal(game.playHour, 2);
  assert.equal(game.playMinutes, 5);
  assert.deepEqual(game.recentAchievements.map(a => a.name), ["new title", "recent title", "middle title"]);
  assert.equal(game.recentAchievements[0].globalPercentage, 12.5);
  assert.equal(game.recentAchievements[0].imgUrl, "https://steamcdn-a.akamaihd.net/icon.jpg");
  assert.match(game.iconUrl!, /icon-hash\.jpg$/);
});

test("Steam supports games without achievement schemas", async () => {
  const [game] = await fetchSteamGames(config, steamFetch({ GetSchemaForGame: Response.json({ game: {} }) }));
  assert.deepEqual(game.recentAchievements, []);
});

test("Steam accepts a genuine no-recent-games result", async () => {
  const games = await fetchSteamGames(config, steamFetch({ GetRecentlyPlayedGames: Response.json({ response: { total_count: 0 } }) }));
  assert.deepEqual(games, []);
});

test("Steam missing/private player data fails the refresh instead of clearing the feed", async () => {
  await assert.rejects(fetchSteamGames(config, steamFetch({ GetRecentlyPlayedGames: Response.json({ response: {} }) })), UpstreamError);
});

test("Steam metadata or player failures do not become a partial successful snapshot", async () => {
  for (const method of ["GetSchemaForGame", "GetPlayerAchievements", "GetGlobalAchievementPercentagesForApp"]) {
    await assert.rejects(fetchSteamGames(config, steamFetch({ [method]: Response.json({}, { status: 503 }) })), UpstreamError);
  }
});

test("unavailable Steam player achievements fail the refresh", async () => {
  await assert.rejects(fetchSteamGames(config, steamFetch({ GetPlayerAchievements: Response.json({ playerstats: { success: false } }) })), UpstreamError);
});

test("schema authentication failures are not mistaken for games without achievements", async () => {
  await assert.rejects(fetchSteamSchema(config, 42, mockFetch(() => Response.json({}, { status: 403 }))), UpstreamError);
});

test("Steam network errors do not expose API keys or request URLs", async () => {
  await assert.rejects(fetchSteamGames(config, mockFetch(url => { throw new Error(`Cannot fetch ${url}`); })), error => {
    assert.ok(error instanceof UpstreamError);
    assert.ok(!error.message.includes(config.apiKey));
    assert.ok(!error.message.includes("https://"));
    return true;
  });
});

test("missing Steam configuration fails without making requests", async () => {
  let called = false;
  await assert.rejects(fetchSteamGames({ ...config, apiKey: "" }, mockFetch(() => { called = true; return Response.json({}); })));
  assert.equal(called, false);
});
