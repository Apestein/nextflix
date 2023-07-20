"use client"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { X, PlusCircle } from "lucide-react"
import useSWR from "swr"
import { type ShowWithVideoAndGenre } from "~/types"
import { env } from "~/env.mjs"

type PageProps = {
  params: {
    id: string
  }
}
export default function ShowPage({ params }: PageProps) {
  const { data } = useSWR<ShowWithVideoAndGenre>(
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos,genres`,
    (url: string) => fetch(url).then((r) => r.json())
  )

  const router = useRouter()

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
    <div
      aria-label="backdrop"
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex justify-between">
            {data?.title}
            <X onClick={() => router.back()} className="cursor-pointer" />
          </CardTitle>
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
          <CardDescription>{data?.overview}</CardDescription>
          {data && (
            <p className="text-sm">
              {data.genres.map((genre) => genre.name).join(", ")}
            </p>
          )}
          <PlusCircle className="h-8 w-8 cursor-pointer" strokeWidth="1.5" />
        </CardHeader>
        <CardContent>
          <iframe
            src={`https://www.youtube.com/embed/${findTrailer() ?? ""}`}
            className="aspect-video w-full"
          />
        </CardContent>
      </Card>
    </div>
  )
}
