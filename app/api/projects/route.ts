import fetchGitData from "@/app/lib/git/gitAPI";

export async function GET() {
	const data = await fetchGitData()
	return Response.json({ data })
}
