import fetchGitData from "@/app/lib/git/gitAPI";

export const revalidate = 0
export async function GET() {
	const data = await fetchGitData()
	return Response.json({ data })
}
