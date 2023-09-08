import { getShows } from "~/lib/client-fetchers"
import { ShowHero } from "~/components/show-hero"
import { ShowBg } from "~/components/show-bg"
import { pickRandomShow } from "~/lib/utils"
import { ShowsCarousel } from "~/components/show-carousel"

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
