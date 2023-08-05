"use client"

import { useState } from "react"
import type { Show, ShowWithVideoAndGenre } from "~/types"
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

export function ShowCard({
  children,
  show,
}: {
  children: React.ReactNode
  show: Show
}) {
  const [open, setOpen] = useState(false)

  const { data: showWithGenreAndVideo } = useSWR<ShowWithVideoAndGenre>(
    open
      ? `https://api.themoviedb.org/3/movie/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos,genres`
      : null,
    (url: string) => fetch(url).then((r) => r.json()),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return (
    <Dialog onOpenChange={() => setOpen((open) => !open)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            {show.title ?? show.name}
            <SaveOrUnsave show={show} />
          </DialogTitle>
          <div className="flex items-center gap-1.5">
            <p className="text-green-400">
              {Math.round((show.vote_average * 100) / 10)}% Match
            </p>
            <p>
              {show.release_date?.substring(0, 4) ??
                show.first_air_date?.substring(0, 4)}
            </p>
            <p className="border border-neutral-500 px-1 text-xs text-white/50">
              EN
            </p>
          </div>
          <DialogDescription>{show.overview}</DialogDescription>
          <ShowGenres show={showWithGenreAndVideo} />
        </DialogHeader>
        <ShowTrailer show={showWithGenreAndVideo} />
      </DialogContent>
    </Dialog>
  )
}

import { PlusCircle, CheckCircle } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { myShowQuery, toggleMyShow } from "~/lib/actions"
import { Icons } from "./icons"
import { useZact } from "~/lib/zact/client"
import { useTransition } from "react"

function SaveOrUnsave({ show }: { show: Show }) {
  const { execute, data, isLoading } = useZact(myShowQuery, {
    id: show.id,
  })
  const [isPending, startTransition] = useTransition()

  if (data === null && !isLoading) return
  if (isLoading) return <Skeleton className="h-6 w-6 rounded-full" />
  if (isPending) return <Icons.spinner className="h-6 w-6 animate-spin" />

  function doUpdate() {
    void toggleMyShow({
      id: show.id,
      movieOrTv: show.title ? "movie" : "tv",
    })
    void execute({ id: show.id })
  }

  return (
    <button onClick={() => startTransition(() => doUpdate())}>
      {data ? (
        <CheckCircle className="h-6 w-6 cursor-pointer" strokeWidth="1.5" />
      ) : (
        <PlusCircle className="h-6 w-6 cursor-pointer" strokeWidth="1.5" />
      )}
    </button>
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

function ShowTrailer({ show }: { show: ShowWithVideoAndGenre | undefined }) {
  if (show === undefined) return <Skeleton className="aspect-video w-full" />
  return (
    <iframe
      src={`https://www.youtube.com/embed/${findTrailer(show)}`}
      className="aspect-video w-full"
    />
  )
}

function findTrailer(show: ShowWithVideoAndGenre) {
  const trailerIndex = show.videos.results.findIndex(
    (item) => item.type === "Trailer",
  )
  if (trailerIndex === -1) return ""
  const trailerKey = show.videos.results[trailerIndex]?.key
  return trailerKey ?? ""
}
