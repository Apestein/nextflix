"use client"

import type { Show, ShowWithVideoAndGenre } from "~/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Skeleton } from "./ui/skeleton"
import { PlusCircle, CheckCircle } from "lucide-react"
import { useEffect } from "react"
import useSWR from "swr"
import { env } from "~/env.mjs"
import { SignedIn } from "@clerk/nextjs"
import { toggleMyShow, getMyShowStatus } from "~/actions"
import { useOptimisticAction, useAction } from "next-safe-action/hook"
import { notFound } from "next/navigation"

export function ShowCard({
  children,
  show,
}: {
  children: React.ReactNode
  show: Show
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-1.5">
            {show.title ?? show.name}
            <SignedIn>
              <SaveOrUnsave show={show} />
            </SignedIn>
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
          <DialogDescription className="text-left">
            {show.overview}
          </DialogDescription>
          <ShowGenres show={show} />
        </DialogHeader>
        <ShowTrailer show={show} />
      </DialogContent>
    </Dialog>
  )
}

function SaveOrUnsave({ show }: { show: Show }) {
  const {
    execute: executeQuery,
    res: initialRes,
    isExecuting,
    hasExecuted,
  } = useAction(getMyShowStatus)
  const {
    execute: executeToggle,
    optimisticData,
    res,
    isExecuting: isRunning,
  } = useOptimisticAction(toggleMyShow, { isSaved: initialRes.data?.isSaved })

  useEffect(() => {
    executeQuery({ id: show.id })
  }, [])

  if (isExecuting && !hasExecuted)
    return <Skeleton className="h-6 w-6 rounded-full" />

  function doUpdate() {
    void executeToggle(
      {
        id: show.id,
        isSaved: res.data?.isSaved ?? initialRes.data!.isSaved,
        movieOrTv: show.title ? "movie" : "tv",
      },
      { isSaved: !res.data?.isSaved ?? !initialRes.data!.isSaved },
    )
  }

  return (
    <button onClick={doUpdate} disabled={isRunning}>
      {optimisticData.isSaved ? (
        <CheckCircle
          className="h-6 w-6 cursor-pointer"
          strokeWidth="1.5"
          opacity={isRunning ? 0.5 : 1}
        />
      ) : (
        <PlusCircle
          className="h-6 w-6 cursor-pointer"
          strokeWidth="1.5"
          opacity={isRunning ? 0.5 : 1}
        />
      )}
    </button>
  )
}

function ShowGenres({ show }: { show: Show }) {
  const { data } = useShowWithVideoAndGenre(show)
  if (data === undefined) return <Skeleton className="h-5 w-full" />
  if ("status_message" in data) notFound()
  return (
    <p className="text-left text-sm">
      {data.genres.map((genre) => genre.name).join(", ")}
    </p>
  )
}

function ShowTrailer({ show }: { show: Show }) {
  const { data } = useShowWithVideoAndGenre(show)
  if (data === undefined) return <Skeleton className="aspect-video w-full" />
  if ("status_message" in data) notFound()
  return (
    <iframe
      src={`https://www.youtube.com/embed/${findTrailer(data)}`}
      className="aspect-video w-full rounded-md"
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

export function useShowWithVideoAndGenre(show: Show) {
  const { data } = useSWR<ShowWithVideoAndGenre | { status_message: string }>(
    `https://api.themoviedb.org/3/movie/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos,genres`,
    (url: string) => fetch(url).then((r) => r.json()),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return { data }
}

// const Spinner = ({ ...props }: LucideProps) => (
//   <svg viewBox="0 0 24 24" fill="none" {...props}>
//     <circle
//       cx="12"
//       cy="12"
//       r="10"
//       className="stroke-slate-200"
//       strokeWidth="4"
//     />
//     <path
//       d="M12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2"
//       className="stroke-emerald-500"
//       strokeWidth="4"
//     />
//   </svg>
// )
