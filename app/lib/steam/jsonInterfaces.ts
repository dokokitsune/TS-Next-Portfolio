"use server"


//interfaces for Steam RecentPlaedGames API 
interface steamGames {
	appid: number,
	name: string,
	playtime_2weeks: number,
	playtime_forever: number,
	img_icon_url: string,
	playtime_windows_forever: number,
	playtime_mac_forever: number,
	playtime_linux_forever: number,
	playtime_deck_forever: number
}

export interface SteamRecentPlayedGames {
	response: {
		total_count: number,
		games: steamGames[]
	}
}


//interfaces for steam GetPlayerAchievments API
interface playerAchivements {
	apiname: string,
	achieved: number,
	unlocktime: number
}

export interface SteamGetPlayerAchivements {
	playerstats: {
		steamID: string,
		gameName: string,
		achievements: playerAchivements[]
	}
}


//interfaces for steam GetGlobalAchievementsPersentages
interface achievementPercentages {
	name: string,
	percent: number
}

export interface SteamGetAchivementPercentages {
	achievements: achievementPercentages[],
}



//interfaces for steamGetSchemaForGame api
interface detailedAchivement {
	name: string,
	defaultvalue: number,
	displayName: string,
	hidden: number,
	description: string,
	icon: string,
	icongray: string
}



interface availableGameStats {
	achievements: detailedAchivement[],
	[key: string]: any[]
}

export interface SteamGetSchemaForGame {
	game: {
		gameName: string,
		gameVersion: string,
		availableGameStats: availableGameStats
	}
}


