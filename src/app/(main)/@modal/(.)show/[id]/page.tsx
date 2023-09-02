import { Modal } from "./modal"
import type { MediaType } from "~/lib/types"
import { getShowVideoAndGenreWithStatus } from "~/lib/server-fetchers"

export default async function ShowModal(props: {
  params: { id: number }
  searchParams: { mediaType: MediaType }
}) {
  const { show, isSaved } = await getShowVideoAndGenreWithStatus(
    props.params.id,
    props.searchParams.mediaType,
  )

  return <Modal show={show} isSaved={isSaved} />
}
