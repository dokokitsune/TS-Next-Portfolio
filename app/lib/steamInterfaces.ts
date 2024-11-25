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
	recentAchievements: Achevement[]
}