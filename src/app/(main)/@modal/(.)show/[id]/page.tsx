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
import { X } from "lucide-react"
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
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos`,
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
          <CardDescription>{data?.overview}</CardDescription>
        </CardHeader>
        <CardContent>
          <iframe
            width="420"
            height="315"
            src={`https://www.youtube.com/embed/${findTrailer() ?? ""}`}
          />
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  )
}
