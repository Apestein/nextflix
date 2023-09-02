import { ERR } from "~/lib/utils"
import { env } from "~/env.mjs"
import type { Show } from "~/lib/types"
import { SearchInput } from "./search-input"
import Link from "next/link"

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
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-4 md:grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))]">
        {shows.map((show) =>
          show.backdrop_path || show.poster_path ? (
            <Link
              href={`/show/${show.id}?mediaType=${show.title ? "movie" : "tv"}`}
              scroll={false}
              key={show.id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://image.tmdb.org/t/p/w300${
                  show.backdrop_path ?? show.poster_path
                }`}
                alt="show-backdrop"
                width={300}
                height={169}
                className="aspect-video max-w-full cursor-pointer object-cover transition-transform hover:scale-110"
              />
            </Link>
          ) : null,
        )}
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
