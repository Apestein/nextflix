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
    limit,
  })
  return shows
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
  const filterNull = data.filter((el): el is Show => !!el)
  return filterNull
}

export async function getShows(mediaType: "movie" | "tv") {
  const [
    trendingRes,
    topRatedRes,
    actionThrillerRes,
    comedyRes,
    horrorRes,
    romanceRes,
    documentaryRes,
  ] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
    ),
    fetch(
      `https://api.themoviedb.org/3/${mediaType}/top_rated?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=28`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=35`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=27`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=10749`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=99`,
    ),
  ])

  if (
    !trendingRes.ok ||
    !topRatedRes.ok ||
    !actionThrillerRes.ok ||
    !comedyRes.ok ||
    !horrorRes.ok ||
    !romanceRes.ok ||
    !documentaryRes.ok
  )
    throw new Error(ERR.fetch)

  const [
    trending,
    topRated,
    actionThriller,
    comedy,
    horror,
    romance,
    documentary,
  ] = await Promise.all<{ results: Show[] }>([
    trendingRes.json(),
    topRatedRes.json(),
    actionThrillerRes.json(),
    comedyRes.json(),
    horrorRes.json(),
    romanceRes.json(),
    documentaryRes.json(),
  ])

  if (
    !trending ||
    !topRated ||
    !actionThriller ||
    !comedy ||
    !horror ||
    !romance ||
    !documentary
  )
    throw new Error(ERR.fetch)

  return {
    trending: trending.results,
    topRated: topRated.results,
    actionThriller: actionThriller.results,
    comedy: comedy.results,
    horror: horror.results,
    romance: romance.results,
    documentary: documentary.results,
  }
}
