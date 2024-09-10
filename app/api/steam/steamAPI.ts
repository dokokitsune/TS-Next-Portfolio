"use server"

import { SteamRecentPlayedGames, SteamGetPlayerAchivements, SteamGetSchemaForGame } from "./jsonInterfaces"




interface Achevement {
	name: string | undefined,
	imgUrl: string | undefined,
	globalPercentage: number
}

export interface Game {
	title: string,
	storePageUrl: string,
	appId: number,
	flyer: string,
	playHour: number,
	playMinutes: number,
	recentAchevements: Achevement[]
}



//fetches app verticalCaptule
const appPoster = ((appid: string) => { return `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/library_600x900_2x.jpg` })


export async function recentPlayedGames<T>(): Promise<T> {
	const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${process.env.STEAM_KEY!}&steamid=${process.env.STEAM_USER_ID!}&count=3`
	const data = await fetch(url, { method: 'GET' })
	if (!data.ok) {
		throw new Error(data.statusText)
	}
	const steamData: SteamRecentPlayedGames = await data.json()

	type recentGames = Game[];

	const gameArray: recentGames = []

	for (const game of steamData.response.games) {
		const title = game.name
		const titleNoSpace = title.replace(/\s+/g, '_')
		const storeUrl = `https://store.steampowered.com/app/${game.appid}/${titleNoSpace}/`
		const flyerUrl = appPoster(game.appid.toString())

		const gameEntry: Game = {
			title: game.name,
			storePageUrl: storeUrl,
			appId: game.appid,
			flyer: flyerUrl,
			playHour: Math.floor(game.playtime_forever / 60),
			playMinutes: Math.floor(game.playtime_forever % 60),
			recentAchevements: await assembleRecentAchievments(game.appid.toString())
		}

		gameArray.push(gameEntry)



	}

	return gameArray as T
}


//Fetchs basic achevement list. (only shows if unlocked, when and api name)
async function fetchAchivedAchivements(appId: string): Promise<SteamGetPlayerAchivements> {
	const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=${appId}&key=${process.env.STEAM_KEY!}&steamid=${process.env.STEAM_USER_ID!}`
	const data = await fetch(url, { method: 'GET' })
	const steamData: SteamGetPlayerAchivements = await data.json()
	//needs logic to sort by most recently achived
	return steamData
}


//Fetchs advanced achevment list. (apiname, displayName, description, icon and icongrey)
async function fetchAllAchivements(appId: string): Promise<SteamGetSchemaForGame> {
	const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?appid=${appId}&key=${process.env.STEAM_KEY}`
	const fetchData = await fetch(url, { method: 'GET' })
	const jsonData: SteamGetSchemaForGame = await fetchData.json()

	//needs logic mainly used to retrive icons and maybe display names for acivements
	return jsonData
}

async function assembleRecentAchievments(appid: string) {
	const achivedAchivements: SteamGetPlayerAchivements = await fetchAchivedAchivements(appid)
	const detaildAchivements: SteamGetSchemaForGame = await fetchAllAchivements(appid)

	const achivedArr = achivedAchivements.playerstats.achievements
	const recentAchArr = achivedArr.sort((a, b) => b.unlocktime - a.unlocktime)

	const top3Ach = recentAchArr.splice(0, 3)

	const gameStats = detaildAchivements.game.availableGameStats.achievements

	type exportAchData = Achevement[]

	const achArray: exportAchData = []



	top3Ach.forEach(ach => {
		const entry = gameStats.find((element) => element.name == ach.apiname)
		const achEntry: Achevement = {
			name: entry?.displayName,
			imgUrl: entry?.icon,
			globalPercentage: 0
		}

		achArray.push(achEntry)



	})

	return achArray


}




