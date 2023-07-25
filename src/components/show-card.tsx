"use client"

import { useState } from "react"
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
import useSWR from "swr"
import { env } from "~/env.mjs"

export function ShowCard({ show }: { show: Show }) {
  const [open, setOpen] = useState(false)

  const { data: showWithGenreAndVideo } = useSWR<ShowWithVideoAndGenre>(
    open
      ? `https://api.themoviedb.org/3/movie/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos,genres`
      : null,
    (url: string) => fetch(url).then((r) => r.json()),
  )

  const { data: isSaved, isValidating } = useSWR<boolean>(
    open ? `/api/my-list/${show.id}` : null,
    (url: string) => fetch(url).then((r) => r.json()),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

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
            <SaveOrUnsave
              isSaved={isSaved}
              showId={show.id}
              isValidating={isValidating}
            />
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
          <ShowGenres show={showWithGenreAndVideo} />
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

import { PlusCircle, CheckCircle } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { useTransition } from "react"
import { useSWRConfig } from "swr"
import { toggleMyShow } from "~/lib/actions"

function SaveOrUnsave({
  isSaved,
  showId,
  isValidating,
}: {
  isSaved: boolean | undefined
  showId: number
  isValidating: boolean
}) {
  const { mutate } = useSWRConfig()
  const [isPending, startTransition] = useTransition()

  if (isSaved === undefined)
    return <Skeleton className="h-6 w-6 rounded-full" />
  if (isPending || isValidating)
    return <SVG.spinner className="h-6 w-6 animate-spin" />
  return (
    <>
      {isSaved ? (
        <button
          onClick={() =>
            startTransition(async () => {
              await toggleMyShow(showId)
              void mutate(`/api/my-list/${showId}`)
            })
          }
        >
          <CheckCircle className="h-6 w-6 cursor-pointer" strokeWidth="1.5" />
        </button>
      ) : (
        <button
          onClick={() =>
            startTransition(async () => {
              await toggleMyShow(showId)
              void mutate(`/api/my-list/${showId}`)
            })
          }
        >
          <PlusCircle className="h-6 w-6 cursor-pointer" strokeWidth="1.5" />
        </button>
      )}
    </>
  )
}

function ShowGenres({ show }: { show: ShowWithVideoAndGenre | undefined }) {
  if (show === undefined) return <Skeleton className="h-5 w-full" />
  return (
    <p className="text-sm">
      {show.genres.map((genre) => genre.name).join(", ")}
    </p>
  )
}

import { type LucideProps } from "lucide-react"

const SVG = {
  spinner: ({ ...props }: LucideProps) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        className="stroke-slate-200"
        strokeWidth="4"
      />
      <path
        d="M12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2"
        className="stroke-emerald-500"
        strokeWidth="4"
      />
    </svg>
  ),
}
