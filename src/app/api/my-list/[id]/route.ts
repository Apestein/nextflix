import { NextResponse } from "next/server"
import { db } from "~/db/client"
import { accounts, profilesToMyShows } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"

export async function GET({ params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json("Unauthorized", { status: 401 })
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: {
      activeProfile: {
        with: {
          profilesToMyShows: {
            where: eq(profilesToMyShows.myShowId, +params.id),
          },
        },
      },
    },
  })
  const savedShow = userAccount?.activeProfile.profilesToMyShows
  if (savedShow?.length) return NextResponse.json(true)
  else return NextResponse.json(false)
}
