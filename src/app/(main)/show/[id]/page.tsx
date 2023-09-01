import { env } from "~/env.mjs"
import { ERR } from "~/lib/utils"
import type { ShowWithVideoAndGenre } from "~/lib/types"
import { accounts, myShows } from "~/db/schema"
import { eq } from "drizzle-orm"
import { db } from "~/db/client"
import { auth } from "@clerk/nextjs"
import { ModalCard } from "~/components/modal-card"

export default async function ShowPage(props: {
  params: { id: number }
  searchParams: { mediaType: "movie" | "tv" }
}) {
  const userId = auth().userId
  if (!userId) return
  const [show, account] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/${props.searchParams.mediaType}/${props.params.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos,genres`,
    )
      .then((r) => r.json() as Promise<ShowWithVideoAndGenre>)
      .catch((err) => console.error(err)),
    db.query.accounts.findFirst({
      where: eq(accounts.id, userId),
      columns: {},
      with: {
        activeProfile: {
          columns: {},
          with: {
            savedShows: {
              where: eq(myShows.id, props.params.id),
              limit: 1,
            },
          },
        },
      },
    }),
  ])
  if (!show || !account) throw new Error(ERR.fetch)
  const isSaved = !!account.activeProfile.savedShows.length
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
