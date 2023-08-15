import { type Show } from "~/lib/types"
import { buttonVariants } from "~/components/ui/button"
import { ShowsCarousel } from "~/components/show-carousel"
import { Play, Info } from "lucide-react"
import Image from "next/image"
import { ERR } from "~/lib/utils"
import { getShows } from "~/lib/fetchers"
import { ShowCard } from "~/components/show-card"
import { cn } from "~/lib/utils"

export default async function Home() {
  const allShows = await getShows("movie")
  const randomShow = pickRandomShow(allShows.trending)

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
            <ShowCard show={randomShow}>
              <div
                className={cn(
                  "flex gap-1.5",
                  buttonVariants({ variant: "default" }),
                )}
              >
                <Play fill="black" />
                Play
              </div>
            </ShowCard>
            <ShowCard show={randomShow}>
              <div
                className={cn(
                  "flex gap-1.5",
                  buttonVariants({ variant: "outline" }),
                )}
              >
                <Info />
                More Info
              </div>
            </ShowCard>
          </div>
        </div>
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

function pickRandomShow(shows: Show[]) {
  const show = shows[Math.floor(Math.random() * shows.length)]
  if (show) return show
  else throw new Error(ERR.undefined)
}
