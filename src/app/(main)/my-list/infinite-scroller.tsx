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
  const [myShows, setMyShows] = useState(initialShows)
  const [simulatedShows, setSimulatedShows] = useState<Show[]>()
  const getShowsReturnRef = useRef<GetShowsReturn>()
  const hasNextPageRef = useRef(initialHasNextPage)
  const indexRef = useRef(0)
  const observerTarget = useRef(null)

  const shows = simulatedShows ?? myShows
  console.log(shows)

  async function fetchNextPage() {
    indexRef.current += 1
    const { data } = await getMyShowsInfinite({
      index: indexRef.current,
      limit,
    })
    if (!data) throw new Error(ERR.db)
    const showsFromTmdb = await getMyShowsFromTmdb(data)
    setMyShows((prev) => [...prev, ...showsFromTmdb])
    hasNextPageRef.current = data.length === limit ? true : false
  }

  async function getSimulatedShows() {
    if (getShowsReturnRef.current) {
      window.scrollTo(0, 0)
      getShowsReturnRef.current = undefined
      hasNextPageRef.current = initialHasNextPage
      setSimulatedShows(undefined)
      return
    }
    window.scrollTo(0, 0)
    const data = await getShows("movie")
    getShowsReturnRef.current = data
    hasNextPageRef.current = true
    setSimulatedShows([
      ...new Map(
        [...data.trending, ...data.topRated].map((item) => [item.id, item]),
      ).values(),
    ])
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasNextPageRef.current) return
        if (entries[0]?.isIntersecting) {
          if (getShowsReturnRef.current) {
            setTimeout(
              () =>
                setSimulatedShows((prev) => [
                  ...new Map(
                    [
                      ...prev!,
                      ...getShowsReturnRef.current!.actionThriller,
                      ...getShowsReturnRef.current!.comedy,
                    ].map((item) => [item.id, item]),
                  ).values(),
                ]),
              1000,
            )
            hasNextPageRef.current = false
          } else void fetchNextPage()
        }
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
      <ul className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-5 md:grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))]">
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
      <section className="flex flex-col items-center gap-4">
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
          <Button variant="outline" className="w-full cursor-auto">
            You have reached the end of your saved shows
          </Button>
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onClick={getSimulatedShows}>
          {simulatedShows ? "Turn off simulation" : "Simulate many saved shows"}
        </Button>
      </section>
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

type GetShowsReturn = Awaited<ReturnType<typeof getShows>>
export async function getShows(mediaType: "movie" | "tv") {
  const [
    trendingRes,
    topRatedRes,
    actionThrillerRes,
    comedyRes,
    horrorRes,
    romanceRes,
    documentaryRes,
  ] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
    ),
    fetch(
      `https://api.themoviedb.org/3/${mediaType}/top_rated?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=28`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=35`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=27`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=10749`,
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API}&with_genres=99`,
    ),
  ])

  if (
    !trendingRes.ok ||
    !topRatedRes.ok ||
    !actionThrillerRes.ok ||
    !comedyRes.ok ||
    !horrorRes.ok ||
    !romanceRes.ok ||
    !documentaryRes.ok
  )
    throw new Error(ERR.fetch)

  const [
    trending,
    topRated,
    actionThriller,
    comedy,
    horror,
    romance,
    documentary,
  ] = await Promise.all<{ results: Show[] }>([
    trendingRes.json(),
    topRatedRes.json(),
    actionThrillerRes.json(),
    comedyRes.json(),
    horrorRes.json(),
    romanceRes.json(),
    documentaryRes.json(),
  ])

  if (
    !trending ||
    !topRated ||
    !actionThriller ||
    !comedy ||
    !horror ||
    !romance ||
    !documentary
  )
    throw new Error(ERR.fetch)

  return {
    trending: trending.results,
    topRated: topRated.results,
    actionThriller: actionThriller.results,
    comedy: comedy.results,
    horror: horror.results,
    romance: romance.results,
    documentary: documentary.results,
  }
}
