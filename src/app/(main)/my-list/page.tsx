import { ShowCard } from "~/components/show-card"
import type { MyShow, Show } from "~/lib/types"
import { env } from "~/env.mjs"
import Image from "next/image"
import { getMyShows } from "~/lib/fetchers"

export default async function MyShowPage() {
  const account = await getMyShows()
  const myShows = account.activeProfile.savedShows
  const shows = await getMyShowsFromApi(myShows)
  return (
    <main className="pt-8">
      {!shows.length && (
        <div className="space-y-3">
          <p className="text-3xl font-semibold">Your list is empty</p>
          <p className="text-white/60">
            Add shows and movies to your list to watch them later
          </p>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-5">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${
                show.backdrop_path ?? show.poster_path
              }`}
              alt="show-backdrop"
              width={240}
              height={135}
              className="aspect-video w-full cursor-pointer object-cover transition-transform hover:scale-110"
            />
          </ShowCard>
        ))}
      </div>
    </main>
  )
}

async function getMyShowsFromApi(shows: MyShow[]) {
  const data = await Promise.all<Show | null>(
    shows.map(async (show) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${show.mediaType}/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
      )
      if (!res.ok) return null
      return res.json()
    }),
  )
  const filterNull = data.filter((el): el is Show => !!el)
  return filterNull
}
