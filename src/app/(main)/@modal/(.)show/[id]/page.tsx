import { env } from "~/env.mjs"
import { ERR } from "~/lib/utils"
import type { ShowWithVideoAndGenre } from "~/lib/types"
import { Modal } from "./modal"

export default async function ShowModal(props: {
  params: { id: string }
  searchParams: { mediaType: "movie" | "tv" }
}) {
  const res = await fetch(
    `https://api.themoviedb.org/3/${props.searchParams.mediaType}/${props.params.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos,genres`,
  )
  if (!res.ok) throw new Error(ERR.fetch)
  const data = (await res.json()) as ShowWithVideoAndGenre
  return <Modal show={data} />
}
