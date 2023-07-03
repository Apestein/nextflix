import { db } from "~/db/client"
import { playingWithNeon } from "~/db/schema"
import { env } from "~/env.mjs"
import { type Show } from "~/types"
import { Button } from "~/components/ui/button"
import { ShowsCarousel } from "~/components/show-carousel"
import { Play } from "lucide-react"

export const revalidate = 5

export default async function Home() {
  // const res = await db.select().from(playingWithNeon)

  const nowPlayingData = getNowPlaying()
  const popularData = getPopular()
  const topRatedData = getTopRated()
  const [nowPlayingShows, popularShows, topRatedShows] = await Promise.all([
    nowPlayingData,
    popularData,
    topRatedData,
  ])

  const randomMovie = pickRandomNowPlayingShow(nowPlayingShows.results)
  return (
    <main className="flex min-h-screen justify-center">
      <div className="container">
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
              <Play fill="black" />
              Play
            </Button>
            <Button variant="outline">More Info</Button>
          </div>
        </div>
        <div className="space-y-6">
          <ShowsCarousel title="Now Playing" shows={nowPlayingShows.results} />
          <ShowsCarousel title="Popular" shows={popularShows.results} />
          <ShowsCarousel title="Top Rated" shows={topRatedShows.results} />
        </div>
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
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US&page=1`
    // { cache: "no-store" }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}

async function getPopular() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US&page=1`
    // { cache: "no-store" }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}

async function getTopRated() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US&page=1`
    // { cache: "no-store" }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json() as Promise<{ results: Show[] }>
}
