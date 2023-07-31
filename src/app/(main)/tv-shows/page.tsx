import type { Show } from "~/types"
import { Button } from "~/components/ui/button"
import { ShowsCarousel } from "~/components/show-carousel"
import { Play } from "lucide-react"
import Image from "next/image"
import { ERR } from "~/lib/utils"
import { getShows } from "~/lib/fetchers"

export default async function TvShows() {
  const allShows = await getShows("tv")
  console.log(allShows)

  const randomMovie = pickRandomShow(allShows.topRated)
  return (
    <>
      <div
        aria-label="background"
        className="absolute inset-0 -z-10 h-screen w-full"
      >
        <div className="h-full w-full bg-black/60 bg-gradient-to-b from-neutral-900/0 to-neutral-900" />
        <Image
          src={`https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`}
          alt={randomMovie.title}
          className="-z-10 object-cover"
          fill
          priority
        />
      </div>
      <main>
        <div className="flex min-h-[384px] max-w-lg flex-col justify-center space-y-3">
          <p className="text-3xl font-bold md:text-4xl">{randomMovie.title}</p>
          <div className="flex space-x-2 text-xs font-semibold md:text-sm">
            <p className="text-green-600">
              {Math.round((randomMovie.vote_average * 100) / 10)}% Match
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
          {/* <ShowsCarousel title="Now Playing" shows={allShows.nowPlaying} /> */}
          <ShowsCarousel title="Top Rated" shows={allShows.topRated} />
          <ShowsCarousel
            title="Action Thriller"
            shows={allShows.actionThriller}
          />
          <ShowsCarousel title="Comedy" shows={allShows.comedy} />
          <ShowsCarousel title="Horror" shows={allShows.horror} />
          <ShowsCarousel title="Romance" shows={allShows.romance} />
          <ShowsCarousel title="Documentary" shows={allShows.documentary} />
        </div>
      </main>
    </>
  )
}

function pickRandomShow(shows: Show[]) {
  const show = shows[Math.floor(Math.random() * shows.length)]
  if (show) return show
  else throw new Error(ERR.undefined)
}
