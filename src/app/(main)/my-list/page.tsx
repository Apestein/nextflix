import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { ShowCard } from "~/components/show-card"
import type { myShow, Show } from "~/types"
import { env } from "~/env.mjs"

export default async function AccountPage() {
  const { userId } = auth()
  if (!userId) throw new Error("No userId")
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
  if (!userAccount) throw new Error("No Account")
  const myShows = userAccount.activeProfile.savedShows

  const shows = await getMyShows(myShows)
  return (
    <main className="flex gap-1.5 pt-3">
      {!shows.length && "You have no saved shows yet."}
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </main>
  )
}

async function getMyShows(shows: myShow[]) {
  const data = await Promise.all(
    shows.map((show) =>
      fetch(
        `https://api.themoviedb.org/3/movie/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
      ).then((r) => r.json()),
    ),
  )
  return data as Show[]
}
