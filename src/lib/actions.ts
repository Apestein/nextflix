"use server"

import { db } from "~/db/client"
import { type Show } from "~/types"
import { myShows, profilesToMyShows } from "~/db/schema"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { accounts } from "~/db/schema"

export async function addMyShow(show: Show) {
  const userId = auth().userId
  if (!userId) throw new Error("Unauthorized")
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  })
  if (!userAccount) throw new Error("Could not find user account")
  await db
    .insert(myShows)
    .values({
      id: show.id,
      backdrop_path: show.backdrop_path,
      title: show.title,
      overview: show.overview,
      vote_average: show.vote_average,
      release_date: show.release_date,
    })
    .onConflictDoNothing()
  await db
    .insert(profilesToMyShows)
    .values({
      myShowId: show.id,
      profileId: userAccount.activeProfileId,
    })
    .onConflictDoNothing()
}
