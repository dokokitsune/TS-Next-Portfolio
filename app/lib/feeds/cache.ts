import "server-only";
import { unstable_cache } from "next/cache";
import githubSnapshot from "./data/github.json";
import steamSnapshot from "./data/steam.json";
import type { gitResponse } from "../gitInterfaces";
import type { Game } from "../steamInterfaces";
import { fetchGitHubProjects, fetchSteamGames, fetchSteamPercentages, fetchSteamSchema } from "./sources";

export interface FeedSnapshot<T> {
  updatedAt: string;
  data: T[];
}

function steamConfig(steamId: string) {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) throw new Error("STEAM_API_KEY is not configured");
  return { apiKey, steamId };
}

const cachedGitHub = unstable_cache(async (username: string) => ({
  updatedAt: new Date().toISOString(),
  data: await fetchGitHubProjects({ username, token: process.env.GITHUB_TOKEN }),
}), ["portfolio-github-v2"], { revalidate: 3600, tags: ["github-feed"] });

const cachedSteamSchema = unstable_cache(
  async (steamId: string, appId: number) => fetchSteamSchema(steamConfig(steamId), appId),
  ["portfolio-steam-schema-v1"], { revalidate: 86400 },
);

const cachedSteamPercentages = unstable_cache(
  async (steamId: string, appId: number) => fetchSteamPercentages(steamConfig(steamId), appId),
  ["portfolio-steam-percentages-v1"], { revalidate: 3600 },
);

const covers = Object.fromEntries(steamSnapshot.data.map(game => [game.appId, game.flyer]));
const cachedSteam = unstable_cache(async (steamId: string) => ({
  updatedAt: new Date().toISOString(),
  data: await fetchSteamGames(steamConfig(steamId), fetch, {
    schema: appId => cachedSteamSchema(steamId, appId),
    percentages: appId => cachedSteamPercentages(steamId, appId),
    covers,
  }),
}), ["portfolio-steam-v1"], { revalidate: 1800, tags: ["steam-feed"] });

export async function getGitHubFeed(): Promise<FeedSnapshot<gitResponse>> {
  try {
    return await cachedGitHub("dokokitsune");
  } catch {
    // Failures inside the cached loader throw, preserving an existing successful entry.
    // The bundled snapshot covers cold starts/builds when no successful cache exists.
    console.warn("GitHub feed unavailable; using the bundled snapshot.");
    return githubSnapshot;
  }
}

export async function getSteamFeed(): Promise<FeedSnapshot<Game>> {
  const steamId = process.env.STEAM_ID || "76561198043263206";
  try {
    return await cachedSteam(steamId);
  } catch {
    console.warn("Steam feed unavailable; using the bundled snapshot.");
    return steamSnapshot;
  }
}
