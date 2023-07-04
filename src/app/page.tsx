// import { db } from "~/db/client"
// import { playingWithNeon } from "~/db/schema"
import { env } from "~/env.mjs"
import { type Show } from "~/types"
import { Button } from "~/components/ui/button"
import { ShowsCarousel } from "~/components/show-carousel"
import { Play } from "lucide-react"

export default async function Home() {
  // const res = await db.select().from(playingWithNeon)

  const nowPlayingData = getNowPlaying()
  const popularData = getPopular()
  const topRatedData = getTopRated()
  const actionTrillersData = getActionThrillers()
  const comediesData = getComedies()
  const horrorData = getHorror()
  const romanceData = getRomance()
  const [
    nowPlayingShows,
    popularShows,
    topRatedShows,
    actionTrillerShows,
    comedyShows,
    horrorShows,
    romanceShows,
  ] = await Promise.all([
    nowPlayingData,
    popularData,
    topRatedData,
    actionTrillersData,
    comediesData,
    horrorData,
    romanceData,
  ])

  const randomMovie = pickRandomNowPlayingShow(nowPlayingShows.results)
  return (
    <main className="container">
      <div className="flex min-h-[384px] max-w-lg flex-col justify-center space-y-3">
        <p className="text-3xl font-bold md:text-4xl">{randomMovie.title}</p>
        <div className="flex space-x-2 text-xs font-semibold md:text-sm">
          <p className="text-green-600">
            {(randomMovie.vote_average * 100) / 10}% Match
          </p>
          <p>{randomMovie.release_date}</p>
        </div>
        <p className="line-clamp-4 text-sm text-gray-300 md:text-base">
          {randomMovie.overview}
        </p>
        <div className="flex items-center gap-3">
          <Button>
            <Play fill="black" className="mr-1" />
            Play
          </Button>
          <Button variant="outline">More Info</Button>
        </div>
      </div>
      <div className="space-y-10">
        <ShowsCarousel title="Now Playing" shows={nowPlayingShows.results} />
        <ShowsCarousel title="Popular" shows={popularShows.results} />
        <ShowsCarousel title="Top Rated" shows={topRatedShows.results} />
        <ShowsCarousel
          title="Action Thriller"
          shows={actionTrillerShows.results}
        />
        <ShowsCarousel title="Comedy" shows={comedyShows.results} />
        <ShowsCarousel title="Horror" shows={horrorShows.results} />
        <ShowsCarousel title="Romance" shows={romanceShows.results} />
      </div>
    </main>
  )
}

function pickRandomNowPlayingShow(shows: Show[]) {
  const show = shows[Math.floor(Math.random() * shows.length)]
  if (show) return show
  else throw new Error("Error getting random show.")
}

async function getNowPlaying() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}

async function getPopular() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}

async function getTopRated() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}

async function getActionThrillers() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=28`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}

async function getComedies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=35`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}

async function getHorror() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=27`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}

async function getRomance() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=10749`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}
