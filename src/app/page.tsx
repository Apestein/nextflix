import { db } from "~/db/client"
import { playingWithNeon } from "~/db/schema"
import { env } from "~/env.mjs"
import { type Show } from "~/types"
import { Button } from "~/components/ui/button"
import { ShowsCarousel } from "~/components/show-carousel"

async function getNowPlaying() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US&page=1`
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default async function Home() {
  // const res = await db.select().from(playingWithNeon)

  function pickRandomShow() {
    const show = results[Math.floor(Math.random() * results.length)]
    if (show) return show
    else throw new Error("Error getting random show.")
  }

  const { results } = (await getNowPlaying()) as { results: Show[] }
  const randomMovie = pickRandomShow()
  return (
    <main className="flex min-h-screen justify-center">
      <div className="container flex flex-col border">
        <div className="max-w-lg space-y-2 pb-12 pt-24">
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
          <div className="space-x-3">
            <Button>Play</Button>
            <Button variant="outline">More Info</Button>
          </div>
        </div>
        <ShowsCarousel shows={results} title="Now Playing" />
      </div>
    </main>
  )
}
