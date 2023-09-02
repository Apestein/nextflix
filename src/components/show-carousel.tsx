"use client"

import { useState, useRef } from "react"
import { cn } from "~/lib/utils"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { type Show } from "~/lib/types"
import Link from "next/link"

type ComponentProps = {
  title: string
  shows: Show[]
}
export const ShowsCarousel = ({ title, shows }: ComponentProps) => {
  const showsRef = useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = useState(false)

  // handle scroll to left and right
  const scrollToDirection = (direction: "left" | "right") => {
    if (!showsRef.current) return

    setIsScrollable(true)
    const { scrollLeft, scrollWidth, clientWidth } = showsRef.current
    const offset =
      direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
    showsRef.current.scrollTo({ left: offset, behavior: "smooth" })

    if (scrollLeft === 0 && direction === "left") {
      showsRef.current.scrollTo({
        left: showsRef.current.scrollWidth,
        behavior: "smooth",
      })
    } else if (
      scrollLeft === scrollWidth - clientWidth &&
      direction === "right"
    ) {
      showsRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      })
    }
  }

  return (
    <section aria-label="Carousel of shows">
      {shows.length !== 0 && (
        <div className="w-full max-w-screen-2xl space-y-1 sm:space-y-2.5">
          <h2 className="text-lg font-semibold text-white/90 transition-colors hover:text-white sm:text-xl">
            {title}
          </h2>
          <div className="group relative">
            {shows.length > 5 ? (
              <>
                <Button
                  aria-label="Scroll to right"
                  variant="ghost"
                  className={cn(
                    "absolute left-0 z-10 h-full rounded-none rounded-r bg-slate-950/50 px-2 py-0 opacity-0 hover:bg-slate-950/50 active:scale-100 group-hover:opacity-100 dark:hover:bg-slate-950/50",
                    isScrollable ? "block" : "hidden",
                  )}
                  onClick={() => scrollToDirection("left")}
                >
                  <ChevronLeft
                    className="h-8 w-8 text-white"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  aria-label="Scroll to left"
                  variant="ghost"
                  className="absolute right-0 z-10 h-full rounded-none rounded-l bg-slate-950/50 px-2 py-0 opacity-0 hover:bg-slate-950/50 active:scale-100 group-hover:opacity-100 dark:hover:bg-slate-950/50"
                  onClick={() => scrollToDirection("right")}
                >
                  <ChevronRight
                    className="h-8 w-8 text-white"
                    aria-hidden="true"
                  />
                </Button>
              </>
            ) : null}
            <div ref={showsRef} className="flex gap-1.5 overflow-hidden">
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
                    className="aspect-video min-w-[160px] cursor-pointer object-cover transition-transform hover:scale-110 md:min-w-[240px]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
