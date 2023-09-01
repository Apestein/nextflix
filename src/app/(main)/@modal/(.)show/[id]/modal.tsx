"use client"
import type { ShowWithVideoAndGenre } from "~/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export function Modal({ show }: { show: ShowWithVideoAndGenre }) {
  const overlay = useRef(null)
  const trailer = show.videos.results.find((el) => el.type === "Trailer")
  const router = useRouter()

  useEffect(() => {
    const back = (e: KeyboardEvent) => e.key === "Escape" && router.back()
    document.addEventListener("keydown", back)
    return () => document.removeEventListener("keydown", back)
  }, [])

  return (
    <div
      ref={overlay}
      onClick={(e) => e.target === overlay.current && router.back()}
      className="fixed inset-0 bg-black/60"
      id="show-modal"
    >
      <Card className="absolute left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2">
        <CardHeader>
          <CardTitle>{show.title ?? show.name}</CardTitle>
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
    </div>
  )
}
