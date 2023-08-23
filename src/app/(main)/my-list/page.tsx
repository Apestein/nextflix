import { ShowScroller } from "./infinite-scroller"
import { getMyShows, getMyShowsFromTmdb } from "~/lib/fetchers"

export default async function MyShowPage() {
  const LIMIT = 30
  const data = await getMyShows(LIMIT)
  const shows = await getMyShowsFromTmdb(data)
  return (
    <main className="pt-8">
      {!shows.length && (
        <div className="mb-4 space-y-3">
          <p className="text-3xl font-semibold">Your list is empty</p>
          <p className="text-white/60">
            Add shows and movies to your list to watch them later
          </p>
        </div>
      )}
      <ShowScroller
        initialShows={shows}
        initialHasNextPage={data.length === LIMIT ? true : false}
        limit={LIMIT}
      />
    </main>
  )
}
