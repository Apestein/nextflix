import { type Show } from "~/lib/types"
import { ShowsCarousel } from "~/components/show-carousel"
import { Play, Info } from "lucide-react"
import Image from "next/image"
import { ERR } from "~/lib/utils"
import { getShows } from "~/lib/client-fetchers"
import Link from "next/link"
import { Button } from "~/components/ui/button"

export default async function Home() {
  const allShows = await getShows("movie")
  const randomShow = pickRandomShow(allShows.trending)

  return (
    <>
      <ShowBg show={randomShow} />
      <main>
        <ShowHero show={randomShow} />
        <div className="space-y-10">
          <ShowsCarousel title="Trending" shows={allShows.trending} />
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

export function ShowBg({ show }: { show: Show }) {
  return (
    <div
      aria-label="background"
      className="absolute inset-0 -z-10 h-screen w-full"
    >
      <div className="h-full w-full bg-black/60 bg-gradient-to-b from-neutral-900/0 to-neutral-900" />
      <Image
        src={`https://image.tmdb.org/t/p/original/${show.backdrop_path}`}
        alt="background-image"
        className="-z-10 object-cover"
        fill
        priority
      />
    </div>
  )
}

export function ShowHero({ show }: { show: Show }) {
  return (
    <div className="flex min-h-[384px] max-w-lg flex-col justify-center space-y-3">
      <p className="text-3xl font-bold md:text-4xl">{show.title}</p>
      <div className="flex space-x-2 text-xs font-semibold md:text-sm">
        <p className="text-green-600">
          {Math.round((show.vote_average * 100) / 10)}% Match
        </p>
        <p>{show.release_date ?? show.first_air_date}</p>
      </div>
      <p className="line-clamp-4 text-sm text-gray-300 md:text-base">
        {show.overview}
      </p>
      <div className="flex items-center gap-3">
        <Link
          href={`/show/${show.id}?mediaType=${show.title ? "movie" : "tv"}`}
          key={show.id}
        >
          <Button className="flex gap-1.5">
            <Play fill="black" />
            Play
          </Button>
        </Link>
        <Link
          href={`/show/${show.id}?mediaType=${show.title ? "movie" : "tv"}`}
          key={show.id}
        >
          <Button variant="outline" className="flex gap-1.5">
            <Info />
            More Info
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function pickRandomShow(shows: Show[]) {
  const show = shows[Math.floor(Math.random() * shows.length)]
  if (show) return show
  else throw new Error(ERR.undefined)
}
