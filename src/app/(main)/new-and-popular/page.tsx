import type { Show } from "~/lib/types"
import { ShowsCarousel } from "~/components/show-carousel"
import { ERR } from "~/lib/utils"
import { env } from "~/env.mjs"
import { ShowBg } from "../../../components/show-bg"
import { ShowHero } from "../../../components/show-hero"
import { pickRandomShow } from "~/lib/utils"

export default async function NewAndPopular() {
  const newAndPopularShows = await getNewAndPopularShows()
  const randomShow = pickRandomShow(newAndPopularShows.trendingMovies)

  return (
    <>
      <ShowBg show={randomShow} />
      <main>
        <ShowHero show={randomShow} />
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
