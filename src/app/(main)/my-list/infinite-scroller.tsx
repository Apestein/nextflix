"use client"
import { useEffect, useRef, useState } from "react"
import type { Show } from "~/lib/types"
import { ShowCard } from "~/components/show-card"
import { getMyShowsInfinite } from "~/actions"
import { getShows } from "~/lib/client-fetchers"
import { ERR } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { ShowCardTrigger } from "~/components/show-card-trigger"

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
  const getShowsReturnRef = useRef<Awaited<ReturnType<typeof getShows>>>()
  const hasNextPageRef = useRef(initialHasNextPage)
  const indexRef = useRef(0)
  const observerTarget = useRef(null)

  const shows = simulatedShows ?? myShows

  async function fetchNextPage() {
    indexRef.current += 1
    const { data } = await getMyShowsInfinite({
      index: indexRef.current,
      limit,
    })
    if (!data) throw new Error(ERR.db)
    setMyShows((prev) => [...prev, ...data.shows])
    hasNextPageRef.current = data.hasNextPage
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
            <ShowCardTrigger show={show} />
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
