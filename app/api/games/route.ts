import { recentPlayedGames } from "@/app/lib/steam/steamAPI";
export async function GET() {
	const data = await recentPlayedGames()
	return Response.json({ data })
}
