import type { gitResponse } from "../gitInterfaces";
import type { Game } from "../steamInterfaces";

export class UpstreamError extends Error {
  constructor(service: string, public status?: number) {
    // Never include request URLs, headers, response bodies, or API keys in errors.
    super(`${service} request failed${status ? ` (HTTP ${status})` : ""}`);
    this.name = "UpstreamError";
  }
}

export type Fetcher = typeof fetch;

async function readJson<T>(
  url: URL | string,
  service: string,
  fetcher: Fetcher,
  headers?: HeadersInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetcher(url, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new UpstreamError(service);
  }
  if (!response.ok) throw new UpstreamError(service, response.status);
  try {
    return await response.json();
  } catch {
    throw new UpstreamError(service);
  }
}

interface GitHubRepository {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  topics?: string[];
  homepage: string | null;
  language: string | null;
  stargazers_count?: number;
  forks_count?: number;
  license?: { spdx_id?: string; name: string } | null;
  archived?: boolean;
  fork?: boolean;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    committer: { date: string } | null;
    author: { date: string } | null;
  };
}

const languageColors: Record<string, string> = {
  Nix: "#7e7eff",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Shell: "#89e051",
  PowerShell: "#012456",
  Go: "#00add8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export async function fetchGitHubProjects(
  { username, token }: { username: string; token?: string },
  fetcher: Fetcher = fetch,
): Promise<gitResponse[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Weston-Wood-Portfolio",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const owner = encodeURIComponent(username);
  const repositories = await readJson<GitHubRepository[]>(
    `https://api.github.com/users/${owner}/repos?sort=pushed&direction=desc&per_page=12`,
    "GitHub repositories",
    fetcher,
    headers,
  );
  if (!Array.isArray(repositories)) throw new UpstreamError("GitHub repositories");

  // Small batches avoid a chain of sequential requests without an unbounded fan-out.
  const projects: gitResponse[] = [];
  for (let index = 0; index < repositories.length; index += 3) {
    const batch = await Promise.all(repositories.slice(index, index + 3).map(async (repo) => {
      if (!repo.name || !repo.html_url || !Number.isFinite(repo.id)) {
        throw new UpstreamError("GitHub repository data");
      }
      let commits: GitHubCommit[];
      try {
        commits = await readJson<GitHubCommit[]>(
          `https://api.github.com/repos/${owner}/${encodeURIComponent(repo.name)}/commits?per_page=1`,
          "GitHub commits",
          fetcher,
          headers,
        );
      } catch (error) {
        // GitHub uses 409 for an empty repository. Other failures invalidate the refresh.
        if (error instanceof UpstreamError && error.status === 409) commits = [];
        else throw error;
      }
      if (!Array.isArray(commits)) throw new UpstreamError("GitHub commit data");
      const latest = commits[0];
      const date = latest?.commit?.committer?.date || latest?.commit?.author?.date;
      if (latest && (!latest.commit?.message || !date)) {
        throw new UpstreamError("GitHub commit data");
      }
      return {
        id: String(repo.id),
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description ?? null,
        topics: repo.topics ?? [],
        homepage: repo.homepage ?? null,
        language: repo.language ?? null,
        languageColor: repo.language ? languageColors[repo.language] ?? null : null,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        license: repo.license?.spdx_id && repo.license.spdx_id !== "NOASSERTION"
          ? repo.license.spdx_id : repo.license?.name ?? null,
        archived: repo.archived ?? false,
        isFork: repo.fork ?? false,
        latestCommit: latest ? {
          sha: latest.sha,
          message: latest.commit.message.split("\n", 1)[0].trim(),
          date,
        } : null,
      };
    }));
    projects.push(...batch);
  }
  return projects;
}

export interface SteamConfig {
  apiKey: string;
  steamId: string;
}

interface RecentGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
}

export interface SchemaAchievement {
  name: string;
  displayName: string;
  icon?: string;
}

export interface AchievementPercentage {
  name: string;
  percent: number;
}

interface PlayerAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
}

function steamUrl(config: SteamConfig, service: string, method: string, version: string, params: Record<string, string>) {
  const url = new URL(`https://api.steampowered.com/${service}/${method}/${version}/`);
  url.search = new URLSearchParams({ key: config.apiKey, ...params }).toString();
  return url;
}

export async function fetchSteamSchema(config: SteamConfig, appId: number, fetcher: Fetcher = fetch): Promise<SchemaAchievement[]> {
  try {
    const result = await readJson<{ game?: { availableGameStats?: { achievements?: SchemaAchievement[] } } }>(
      steamUrl(config, "ISteamUserStats", "GetSchemaForGame", "v2", { appid: String(appId), l: "english" }),
      "Steam achievement schema",
      fetcher,
    );
    if (!result.game) throw new UpstreamError("Steam achievement schema");
    const achievements = result.game.availableGameStats?.achievements ?? [];
    if (!Array.isArray(achievements)) throw new UpstreamError("Steam achievement schema");
    return achievements;
  } catch (error) {
    if (error instanceof UpstreamError && [400, 404].includes(error.status ?? 0)) return [];
    throw error;
  }
}

export async function fetchSteamPercentages(config: SteamConfig, appId: number, fetcher: Fetcher = fetch): Promise<AchievementPercentage[]> {
  const result = await readJson<{ achievementpercentages?: { achievements?: AchievementPercentage[] } }>(
    steamUrl(config, "ISteamUserStats", "GetGlobalAchievementPercentagesForApp", "v2", { gameid: String(appId) }),
    "Steam achievement percentages",
    fetcher,
  );
  const percentages = result.achievementpercentages?.achievements;
  if (!Array.isArray(percentages)) throw new UpstreamError("Steam achievement percentages");
  return percentages;
}

interface SteamMetadata {
  schema: (appId: number) => Promise<SchemaAchievement[]>;
  percentages: (appId: number) => Promise<AchievementPercentage[]>;
  covers?: Record<number, string>;
}

export async function fetchSteamGames(
  config: SteamConfig,
  fetcher: Fetcher = fetch,
  metadata?: SteamMetadata,
): Promise<Game[]> {
  if (!config.apiKey || !/^\d{17}$/.test(config.steamId)) {
    throw new Error("Steam server configuration is missing");
  }
  const result = await readJson<{ response?: { total_count?: number; games?: RecentGame[] } }>(
    steamUrl(config, "IPlayerService", "GetRecentlyPlayedGames", "v1", { steamid: config.steamId, count: "3" }),
    "Steam recent games",
    fetcher,
  );
  if (result.response?.total_count === 0) return [];
  if (!Array.isArray(result.response?.games)) throw new UpstreamError("Steam recent games");

  const games: Game[] = [];
  for (const game of result.response.games.slice(0, 3)) {
    if (!Number.isInteger(game.appid) || !game.name || !Number.isFinite(game.playtime_forever)) {
      throw new UpstreamError("Steam game data");
    }
    const schema = await (metadata?.schema(game.appid) ?? fetchSteamSchema(config, game.appid, fetcher));
    const recentAchievements: Game["recentAchievements"] = [];
    if (schema.length) {
      const [player, percentages] = await Promise.all([
        readJson<{ playerstats?: { success: boolean; achievements?: PlayerAchievement[] } }>(
          steamUrl(config, "ISteamUserStats", "GetPlayerAchievements", "v1", { steamid: config.steamId, appid: String(game.appid), l: "english" }),
          "Steam player achievements",
          fetcher,
        ),
        metadata?.percentages(game.appid) ?? fetchSteamPercentages(config, game.appid, fetcher),
      ]);
      if (!player.playerstats?.success || !Array.isArray(player.playerstats.achievements)) {
        throw new UpstreamError("Steam player achievements");
      }
      const unlocked = player.playerstats.achievements
        .filter(achievement => achievement.achieved === 1 && achievement.unlocktime > 0)
        .sort((a, b) => b.unlocktime - a.unlocktime)
        .slice(0, 3);
      for (const achievement of unlocked) {
        const details = schema.find(item => item.name === achievement.apiname);
        recentAchievements.push({
          name: details?.displayName || achievement.apiname,
          imgUrl: details?.icon,
          globalPercentage: Number(percentages.find(item => item.name === achievement.apiname)?.percent ?? 0),
        });
      }
    }
    games.push({
      appId: game.appid,
      title: game.name,
      storePageUrl: `https://store.steampowered.com/app/${game.appid}/`,
      flyer: metadata?.covers?.[game.appid] || `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/library_600x900.jpg`,
      ...(game.img_icon_url ? { iconUrl: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` } : {}),
      playHour: Math.floor(game.playtime_forever / 60),
      playMinutes: game.playtime_forever % 60,
      recentAchievements,
    });
  }
  return games;
}
