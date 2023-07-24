import { NextRequest, NextResponse } from "next/server"
import { db } from "~/db/client"
import { accounts, profilesToMyShows } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"

export function GET({ params }: { params: { id: string } }) {
  // const { userId } = auth()
  // console.log(params.id)
  // if (!userId) return NextResponse.json("Unauthorized", { status: 401 })
  // const userAccount = await db.query.accounts.findFirst({
  //   where: eq(accounts.id, userId),
  //   with: {
  //     activeProfile: {
  //       with: {
  //         profilesToMyShows: {
  //           where: eq(profilesToMyShows.myShowId, Number(params.id)),
  //         },
  //       },
  //     },
  //   },
  // })
  // const savedShow = userAccount?.activeProfile.profilesToMyShows
  // if (userAccount && savedShow?.length) return NextResponse.json(true)
  // else return NextResponse.json(false)

  return NextResponse.json(params.id)
}
