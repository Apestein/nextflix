import { ShowsCarousel } from "~/components/show-carousel"
import { getShows } from "~/lib/client-fetchers"
import { ShowBg } from "../../../components/show-bg"
import { ShowHero } from "../../../components/show-hero"
import { pickRandomShow } from "~/lib/utils"

export default async function TvShows() {
  const allShows = await getShows("tv")
  const randomShow = pickRandomShow(allShows.topRated)

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
