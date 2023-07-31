import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { ShowCard } from "~/components/show-card"
import type { myShow, Show } from "~/types"
import { env } from "~/env.mjs"
import { ERR } from "~/lib/utils"

export default async function AccountPage() {
  const { userId } = auth()
  if (!userId) throw new Error(ERR.unauthenticated)
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: {
      activeProfile: {
        with: {
          savedShows: true,
        },
      },
    },
  })
  if (!userAccount) throw new Error(ERR.db)
  const myShows = userAccount.activeProfile.savedShows

  const shows = await getMyShows(myShows)
  return (
    <main className="h-full pt-12">
      {!shows.length && (
        <div className="space-y-3">
          <p className="text-3xl font-semibold">Your list is empty</p>
          <p className="text-white/60">
            Add shows and movies to your list to watch them later
          </p>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-y-5">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </main>
  )
}

async function getMyShows(shows: myShow[]) {
  const data = await Promise.all<Show>(
    shows.map((show) =>
      fetch(
        `https://api.themoviedb.org/3/movie/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
      ).then((r) => {
        if (!r.ok) throw new Error(ERR.fetch)
        return r.json()
      }),
    ),
  )
  return data
}
