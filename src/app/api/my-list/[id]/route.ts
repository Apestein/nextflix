import { NextResponse } from "next/server"
import { db } from "~/db/client"
import { accounts, myShows } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId } = auth()
  if (!userId) return NextResponse.json("Unauthorized", { status: 401 })
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: {
      activeProfile: {
        with: {
          savedShows: {
            where: eq(myShows.id, +params.id),
          },
        },
      },
    },
  })
  const savedShow = userAccount?.activeProfile.savedShows
  if (savedShow?.length) return NextResponse.json(true)
  else return NextResponse.json(false)
}
