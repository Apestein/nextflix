"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import useSWR from "swr"
import { type Show } from "~/types"
import { env } from "~/env.mjs"

type PageProps = {
  params: {
    id: string
  }
}
export default function ShowPage({ params }: PageProps) {
  const { data } = useSWR<Show>(
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos,genres`,
    (url: string) => fetch(url).then((r) => r.json())
  )

  function findTrailer() {
    if (!data) return
    const trailerIndex = data.videos.results.findIndex(
      (item) => item.type === "Trailer"
    )
    if (trailerIndex === -1) return
    const trailerKey = data.videos.results[trailerIndex]?.key
    return trailerKey
  }

  return (
    <Dialog defaultOpen>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            {data?.title}
            <PlusCircle className="h-6 w-6 cursor-pointer" strokeWidth="1.5" />
          </DialogTitle>
          {data && (
            <div className="flex items-center gap-1.5">
              <p className="text-green-400">
                {Math.round((data.vote_average * 100) / 10)}% Match
              </p>
              <p>{data.release_date?.substring(0, 4)}</p>
              <p className="border border-neutral-500 px-1 text-xs text-white/50">
                EN
              </p>
            </div>
          )}
          <DialogDescription>{data?.overview}</DialogDescription>
        </DialogHeader>
        <iframe
          src={`https://www.youtube.com/embed/${findTrailer() ?? ""}`}
          className="aspect-video w-full"
        />
      </DialogContent>
    </Dialog>
  )
}
