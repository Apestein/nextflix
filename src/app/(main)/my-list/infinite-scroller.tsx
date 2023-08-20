"use client"
import { useEffect, useRef, useState } from "react"
import type { Show, MyShow } from "~/lib/types"
import { ShowCard } from "~/components/show-card"
import Image from "next/image"
import { getMyShowsInfinite } from "~/actions"
import { env } from "~/env.mjs"
import { ERR } from "~/lib/utils"
import { Button } from "~/components/ui/button"

export function ShowScroller({
  initialShows,
  initialHasNextPage,
  limit,
}: {
  initialShows: Show[]
  initialHasNextPage: boolean
  limit: number
}) {
  const [shows, setShows] = useState(initialShows)
  const hasNextPageRef = useRef(initialHasNextPage)
  const indexRef = useRef(0)
  const observerTarget = useRef(null)

  async function fetchNextPage() {
    indexRef.current += 1
    const { data } = await getMyShowsInfinite({
      index: indexRef.current,
      limit,
    })
    if (!data) throw new Error(ERR.undefined)
    const showsFromTmdb = await getMyShowsFromTmdb(data)
    setShows((prev) => [...prev, ...showsFromTmdb])
    hasNextPageRef.current = data.length === limit ? true : false
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        if (!hasNextPageRef.current) observer.disconnect()
        if (entries[0]?.isIntersecting) void fetchNextPage()
      },
      { threshold: 1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <main className="space-y-1.5 [overflow-anchor:none]">
      <ul className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-5">
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
      </ul>
      <div ref={observerTarget}></div>
      {hasNextPageRef.current ? (
        <Button
          variant="outline"
          className="w-full animate-pulse"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={fetchNextPage}
        >
          Loading...
        </Button>
      ) : (
        <Button variant="outline" className="w-full">
          You have reached the end of your saved shows
        </Button>
      )}
    </main>
  )
}

async function getMyShowsFromTmdb(shows: MyShow[]) {
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
