"use client"
import { useSnapCarousel } from "react-snap-carousel"
import { cn } from "~/lib/utils"
import type { Show } from "~/lib/types"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

export function SnapCarousel({ shows }: { shows: Show[] }) {
  const { scrollRef, snapPointIndexes, next, prev, pages, goTo } =
    useSnapCarousel()

  return (
    <>
      <OverlayScrollbarsComponent
        options={{
          scrollbars: { theme: "os-theme-light", autoHide: "leave" },
        }}
        defer
      >
        <ul className="flex gap-1.5">
          {shows.map((show, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={`https://image.tmdb.org/t/p/w300${
                show.backdrop_path ?? show.poster_path
              }`}
              alt="show-backdrop"
              width={240}
              height={135}
              className={cn(
                "aspect-video min-w-[160px] cursor-pointer object-cover transition-transform hover:scale-110 md:min-w-[240px]",
                // snapPointIndexes.has(i) && "snap-start",
              )}
            />
          ))}
        </ul>
      </OverlayScrollbarsComponent>
      {/* <ul
        className="not-mobile:scrollbar-thin scrollbar-thumb-black flex snap-x snap-mandatory gap-1.5 overflow-x-auto"
        ref={scrollRef}
      >
        {shows.map((show, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={`https://image.tmdb.org/t/p/w300${
              show.backdrop_path ?? show.poster_path
            }`}
            alt="show-backdrop"
            width={240}
            height={135}
            className={cn(
              "aspect-video min-w-[160px] cursor-pointer object-cover transition-transform hover:scale-110 md:min-w-[240px]",
              // snapPointIndexes.has(i) && "snap-start",
            )}
          />
        ))}
      </ul> */}
      {/* <div className="space-x mt-2 flex justify-center" aria-hidden>
        <button
          className="mx-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => prev()}
        >
          Previous
        </button>
        {pages.map((_, i) => (
          <button
            key={i}
            className="mx-2 rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
            onClick={() => goTo(i)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => next()}
        >
          Next
        </button>
      </div> */}
    </>
  )
}
