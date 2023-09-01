"use client"
import type { ShowWithVideoAndGenre } from "~/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { PlusCircle, CheckCircle } from "lucide-react"
import { toggleMyShow } from "~/actions"
import { useOptimisticAction } from "next-safe-action/hook"

interface ModalCardProps extends React.ComponentPropsWithoutRef<"div"> {
  show: ShowWithVideoAndGenre
  isSaved?: boolean
}
export function ModalCard({ show, isSaved, ...props }: ModalCardProps) {
  const trailer = show.videos.results.find((el) => el.type === "Trailer")
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          {show.title ?? show.name}
          {isSaved !== undefined && (
            <MyShowToggler show={show} isSaved={isSaved} />
          )}
        </CardTitle>
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
        <CardDescription>{show.overview}</CardDescription>
        <p className="text-left text-sm">
          {show.genres.map((genre) => genre.name).join(", ")}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {trailer ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}`}
            className="aspect-video w-full rounded-lg"
          />
        ) : (
          <div className="grid aspect-video animate-pulse place-content-center text-xl font-semibold">
            No Trailer
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MyShowToggler({
  show,
  isSaved,
}: {
  show: ShowWithVideoAndGenre
  isSaved: boolean
}) {
  const {
    execute: executeToggle,
    optimisticData,
    res,
    isExecuting,
  } = useOptimisticAction(toggleMyShow, { isSaved })

  function toggle() {
    void executeToggle(
      {
        id: show.id,
        isSaved: res.data?.isSaved ?? isSaved,
        movieOrTv: show.title ? "movie" : "tv",
      },
      { isSaved: !res.data?.isSaved ?? !isSaved },
    )
  }

  return (
    <button onClick={toggle} disabled={isExecuting}>
      {optimisticData.isSaved ? (
        <CheckCircle
          className="h-6 w-6 cursor-pointer"
          strokeWidth="1.5"
          opacity={isExecuting ? 0.5 : 1}
        />
      ) : (
        <PlusCircle
          className="h-6 w-6 cursor-pointer"
          strokeWidth="1.5"
          opacity={isExecuting ? 0.5 : 1}
        />
      )}
    </button>
  )
}
