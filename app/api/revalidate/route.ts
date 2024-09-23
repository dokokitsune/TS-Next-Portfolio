import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
	const secret = req.nextUrl.searchParams.get('secret')

	if (secret !== process.env.REVALIDATION_SECRET)
		return NextResponse.json({ message: "Invalid Secret" }, { status: 401 })

	revalidatePath('/aboutMe')
	revalidatePath('/projects')
	return NextResponse.json({ revalidated: true, now: Date.now() })
}
