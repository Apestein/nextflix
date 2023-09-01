import { env } from "~/env.mjs"
import type { Show, MyShow } from "~/lib/types"
import { ERR } from "~/lib/utils"
import { db } from "~/db/client"
import { eq } from "drizzle-orm"
import { accounts, profiles, myShows } from "~/db/schema"
import { auth } from "@clerk/nextjs"

export async function getAccount() {
  const userId = auth().userId
  if (!userId) throw new Error(ERR.unauthenticated)
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  })
  if (!account) throw new Error(ERR.db)
  return account
}

export async function getAccountWithActiveProfile() {
  const userId = auth().userId
  if (!userId) throw new Error(ERR.unauthenticated)
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    columns: { activeProfileId: true },
    with: {
      activeProfile: true,
    },
  })
  if (!account) throw new Error(ERR.db)
  return account
}

export async function getAccountWithProfiles() {
  const userId = auth().userId
  if (!userId) throw new Error(ERR.unauthenticated)
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: {
      profiles: true,
    },
  })
  if (!account) throw new Error(ERR.db)
  return account
}

export async function getProfile(profileId: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, profileId),
  })
  if (!profile) throw new Error(ERR.db)
  return profile
}

export async function getMyShows(limit: number) {
  const account = await getAccountWithActiveProfile()
  const shows = await db.query.myShows.findMany({
    where: eq(myShows.profileId, account.activeProfileId),
    limit: limit + 1,
  })
  const hasNextPage = shows.length > limit ? true : false
  if (hasNextPage) shows.pop()
  const filteredShows = await getMyShowsFromTmdb(shows)
  return { shows: filteredShows, hasNextPage }
}

export async function getMyShowsFromTmdb(shows: MyShow[]) {
  const data = await Promise.all<Show | null>(
    shows.map(async (show) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${show.mediaType}/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
      )
      if (!res.ok) return null
      return res.json()
    }),
  )
  const filteredShows = data.filter((el): el is Show => !!el)
  return filteredShows
}
