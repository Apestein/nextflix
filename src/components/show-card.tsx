"use client"
import * as React from "react"
import type { Show, ShowWithVideoAndGenre } from "~/types"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { PlusCircle, Check } from "lucide-react"
import useSWR from "swr"
import { env } from "~/env.mjs"
import { Skeleton } from "./ui/skeleton"
import { addMyShow } from "~/lib/actions"

export function ShowCard({ show }: { show: Show }) {
  const [open, setOpen] = React.useState(false)

  const { data: showWithGenreAndVideo, isLoading } =
    useSWR<ShowWithVideoAndGenre>(
      open
        ? `https://api.themoviedb.org/3/movie/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos,genres`
        : null,
      (url: string) => fetch(url).then((r) => r.json()),
    )

  const { data: isSaved } = useSWR<boolean>(open ? `/my-list/${show.id}` : null)
  console.log({ isSaved, showWithGenreAndVideo })

  function findTrailer(show: ShowWithVideoAndGenre | undefined) {
    if (!show) return
    const trailerIndex = show.videos?.results.findIndex(
      (item) => item.type === "Trailer",
    )
    if (trailerIndex === -1 || !trailerIndex) return
    const trailerKey = show.videos?.results[trailerIndex]?.key
    return trailerKey
  }

  return (
    <Dialog onOpenChange={() => setOpen(!open)}>
      <DialogTrigger>
        <Image
          src={`https://image.tmdb.org/t/p/w500${show.backdrop_path}`}
          alt="show-backdrop"
          width={240}
          height={135}
          className="min-w-[240px] cursor-pointer transition-transform hover:scale-110"
        />
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            {show.title}
            <button
              onClick={() => React.startTransition(() => void addMyShow(show))}
            >
              <PlusCircle
                className="h-6 w-6 cursor-pointer"
                strokeWidth="1.5"
              />
            </button>
          </DialogTitle>
          <div className="flex items-center gap-1.5">
            <p className="text-green-400">
              {Math.round((show.vote_average * 100) / 10)}% Match
            </p>
            <p>{show.release_date.substring(0, 4)}</p>
            <p className="border border-neutral-500 px-1 text-xs text-white/50">
              EN
            </p>
          </div>
          <DialogDescription>{show.overview}</DialogDescription>
          {isLoading ? (
            <Skeleton className="h-5 w-full" />
          ) : (
            <p className="text-sm">
              {showWithGenreAndVideo?.genres
                .map((genre) => genre.name)
                .join(", ")}
            </p>
          )}
        </DialogHeader>
        <iframe
          src={`https://www.youtube.com/embed/${
            findTrailer(showWithGenreAndVideo) ?? ""
          }`}
          className="aspect-video w-full"
        />
      </DialogContent>
    </Dialog>
  )
}
