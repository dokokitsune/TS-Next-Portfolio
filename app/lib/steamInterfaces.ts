export interface Achievement {
  name: string | undefined;
  imgUrl: string | undefined;
  globalPercentage: number;
}
export interface Game {
  title: string;
  storePageUrl: string;
  appId: number;
  flyer: string;
  iconUrl?: string;
  playHour: number;
  playMinutes: number;
  recentAchievements: Achievement[];
}
