import { ERR } from "~/lib/utils"
import { env } from "~/env.mjs"
import type { Show } from "~/lib/types"
import { ShowCard } from "~/components/show-card"
import Image from "next/image"
import { SearchInput } from "./search-input"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { keyword: string }
}) {
  if (!searchParams.keyword)
    return (
      <main>
        <SearchInput initialQuery="" className="my-8" />
      </main>
    )
  const shows = await searchShows(searchParams.keyword)
  return (
    <main>
      <SearchInput initialQuery={searchParams.keyword} className="my-8" />
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-4">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show}>
            <Image
              src={
                show.backdrop_path ?? show.poster_path
                  ? `https://image.tmdb.org/t/p/w500${
                      show.backdrop_path ?? show.poster_path
                    }`
                  : "/nothing-to-see.webp"
              }
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

async function searchShows(query: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${env.NEXT_PUBLIC_TMDB_API}&query=${query}`,
  )
  if (!res.ok) throw new Error(ERR.fetch)
  const shows = (await res.json()) as { results: Show[] }
  const popularShows = shows.results.sort((a, b) => b.popularity - a.popularity)
  return popularShows
}
