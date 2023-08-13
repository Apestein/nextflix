import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { ShowCard } from "~/components/show-card"
import type { MyShow, Show } from "~/lib/types"
import { env } from "~/env.mjs"
import { ERR } from "~/lib/utils"
import Image from "next/image"

export default async function MyShowPage() {
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
    <main className="pt-8">
      {!shows.length && (
        <div className="space-y-3">
          <p className="text-3xl font-semibold">Your list is empty</p>
          <p className="text-white/60">
            Add shows and movies to your list to watch them later
          </p>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-5">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${
                show.backdrop_path ?? show.poster_path
              }`}
              alt="show-backdrop"
              width={240}
              height={135}
              className="aspect-video w-full cursor-pointer object-cover transition-transform hover:scale-110"
            />
          </ShowCard>
        ))}
      </div>
    </main>
  )
}

async function getMyShows(shows: MyShow[]) {
  const data = await Promise.all<Show>(
    shows.map(async (show) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${show.mediaType}/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}`,
      )
      if (!res.ok) throw new Error(ERR.fetch)
      return res.json()
    }),
  )
  return data
}
