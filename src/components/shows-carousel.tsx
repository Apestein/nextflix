"use client"
import { useSnapCarousel } from "react-snap-carousel"
import type { Show } from "~/lib/types"
import { useRef } from "react"
import { useDraggable } from "react-use-draggable-scroll"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { type MutableRefObject, type RefCallback } from "react"

export function ShowsCarousel({
  title,
  shows,
}: {
  title: string
  shows: Show[]
}) {
  const { scrollRef, next, prev } = useSnapCarousel()

  const dragRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
  const { events } = useDraggable(dragRef)

  return (
    <section>
      <div className="w-full max-w-screen-2xl space-y-1 sm:space-y-2.5">
        <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
        <div className="group relative flex items-center">
          <Button
            aria-label="scroll left"
            variant="ghost"
            className="mobile:hidden absolute left-0 z-10 h-[90px] rounded-none rounded-r bg-slate-950/50 px-2 py-0 opacity-0 group-hover:opacity-100 hover:bg-slate-950/75 md:h-[135px]"
            onClick={() => prev()}
          >
            <ChevronLeft className="h-8 w-8 text-white" aria-hidden="true" />
          </Button>
          <Button
            aria-label="scroll right"
            variant="ghost"
            className="mobile:hidden absolute right-0 z-10 h-[90px] rounded-none rounded-l bg-slate-950/50 px-2 py-0 opacity-0 group-hover:opacity-100 hover:bg-slate-950/75 md:h-[135px]"
            onClick={() => next()}
          >
            <ChevronRight className="h-8 w-8 text-white" aria-hidden="true" />
          </Button>
          <div
            className="flex gap-1.5 overflow-auto py-2 scrollbar-none"
            ref={mergeRefs(dragRef, scrollRef)}
            {...events}
          >
            {shows.map((show) => (
              <Link
                href={`/show/${show.id}?mediaType=${
                  show.title ? "movie" : "tv"
                }`}
                scroll={false}
                key={show.id}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://image.tmdb.org/t/p/w300${
                    show.backdrop_path ?? show.poster_path
                  }`}
                  alt="show-backdrop"
                  width={240}
                  height={135}
                  className="aspect-video min-w-[160px] object-cover transition-transform hover:scale-110 md:min-w-[240px]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type MutableRefList<T> = Array<
  RefCallback<T> | MutableRefObject<T> | undefined | null
>
function mergeRefs<T>(...refs: MutableRefList<T>): RefCallback<T> {
  return (val: T) => {
    setRef(val, ...refs)
  }
}

function setRef<T>(val: T, ...refs: MutableRefList<T>): void {
  refs.forEach((ref) => {
    if (typeof ref === "function") {
      ref(val)
    } else if (ref != null) {
      ref.current = val
    }
  })
}
