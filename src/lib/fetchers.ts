import { env } from "~/env.mjs"
import { type Show } from "~/lib/types"
import { ERR } from "~/lib/utils"
import { db } from "~/db/client"
import { eq } from "drizzle-orm"
import { accounts, profiles } from "~/db/schema"

export async function getAccount(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  })
  if (!account) throw new Error(ERR.db)
  return account
}

export async function getAccountWithProfiles(userId: string) {
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
