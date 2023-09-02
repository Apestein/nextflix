import { ModalCard } from "~/components/modal-card"
import type { MediaType } from "~/lib/types"
import { getShowVideoAndGenreWithStatus } from "~/lib/server-fetchers"

export default async function ShowPage(props: {
  params: { id: number }
  searchParams: { mediaType: MediaType }
}) {
  const { show, isSaved } = await getShowVideoAndGenreWithStatus(
    props.params.id,
    props.searchParams.mediaType,
  )
  return (
    <main className="mt-4">
      <ModalCard
        show={show}
        isSaved={isSaved}
        className="mx-auto w-full max-w-3xl"
      />
    </main>
  )
}
