import type { Show } from "~/lib/types"
import { Button } from "~/components/ui/button"
import { ShowsCarousel } from "~/components/show-carousel"
import { Play } from "lucide-react"
import Image from "next/image"
import { ERR } from "~/lib/utils"
import { env } from "~/env.mjs"
import { pickRandomShow } from "../page"

export default async function NewAndPopular() {
  const newAndPopularShows = await getNewAndPopularShows()
  const randomShow = pickRandomShow(newAndPopularShows.trendingMovies)

  return (
    <>
      <div
        aria-label="background"
        className="absolute inset-0 -z-10 h-screen w-full"
      >
        <div className="h-full w-full bg-black/60 bg-gradient-to-b from-neutral-900/0 to-neutral-900" />
        <Image
          src={`https://image.tmdb.org/t/p/original/${randomShow.backdrop_path}`}
          alt="background-image"
          className="-z-10 object-cover"
          fill
          priority
        />
      </div>
      <main>
        <div className="flex min-h-[384px] max-w-lg flex-col justify-center space-y-3">
          <p className="text-3xl font-bold md:text-4xl">{randomShow.title}</p>
          <div className="flex space-x-2 text-xs font-semibold md:text-sm">
            <p className="text-green-600">
              {Math.round((randomShow.vote_average * 100) / 10)}% Match
            </p>
            <p>{randomShow.release_date ?? randomShow.first_air_date}</p>
          </div>
          <p className="line-clamp-4 text-sm text-gray-300 md:text-base">
            {randomShow.overview}
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
          <ShowsCarousel
            title="Popular Movies"
            shows={newAndPopularShows.popularMovies}
          />
          <ShowsCarousel
            title="Popular TV Shows"
            shows={newAndPopularShows.popularTvs}
          />
          <ShowsCarousel
            title="Trending Movies"
            shows={newAndPopularShows.trendingMovies}
          />
          <ShowsCarousel
            title="Trending TV Shows"
            shows={newAndPopularShows.trendingTvs}
          />
        </div>
      </main>
    </>
  )
}

async function getNewAndPopularShows() {
  const [popularTvRes, popularMovieRes, trendingTvRes, trendingMovieRes] =
    await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
      ),
      fetch(
        `https://api.themoviedb.org/3/trending/tv/day?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
      ),
      fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
      ),
    ])

  if (
    !popularTvRes.ok ||
    !popularMovieRes.ok ||
    !trendingTvRes.ok ||
    !trendingMovieRes.ok
  ) {
    throw new Error(ERR.fetch)
  }

  const [popularTvs, popularMovies, trendingTvs, trendingMovies] =
    await Promise.all<{ results: Show[] }>([
      popularTvRes.json(),
      popularMovieRes.json(),
      trendingTvRes.json(),
      trendingMovieRes.json(),
    ])

  if (!popularTvs || !popularMovies || !trendingTvs || !trendingMovies)
    throw new Error(ERR.fetch)

  return {
    popularTvs: popularTvs.results,
    popularMovies: popularMovies.results,
    trendingTvs: trendingTvs.results,
    trendingMovies: trendingMovies.results,
  }
}
