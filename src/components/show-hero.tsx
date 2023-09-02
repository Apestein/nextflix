import { type Show } from "~/lib/types"
import { Play, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"

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
