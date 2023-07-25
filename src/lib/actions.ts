"use server"

import { db } from "~/db/client"
import { myShows } from "~/db/schema"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { accounts } from "~/db/schema"

export async function toggleMyShow(showId: number) {
  const userId = auth().userId
  if (!userId) throw new Error("Unauthorized")
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  })
  if (!userAccount) throw new Error("Could not find user account")
  const res = await db
    .insert(myShows)
    .values({
      id: showId,
      profileId: userAccount.activeProfileId,
    })
    .onConflictDoNothing()

  if (!res.rowCount) await db.delete(myShows).where(eq(myShows.id, showId))
}
