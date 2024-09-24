import { recentPlayedGames } from "@/app/lib/steam/steamAPI";


export const revalidate = 0
export async function GET() {
	const data = await recentPlayedGames()
	return Response.json({ data })
}
