import { db } from "~/db/client"
import { profiles } from "~/db/schema"
import { eq, lt, gte, ne } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import Image from "next/image"

export default async function AccountPage() {
  const { userId } = auth()
  if (!userId) throw new Error("No userId")
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, 3),
    with: {
      myShows: true,
    },
  })
  if (!profile) throw new Error("No profile")
  return (
    <main className="pt-12">
      {profile.myShows.map((show) => (
        <Image
          key={show.id}
          src={`https://image.tmdb.org/t/p/w500${show.backdropPath ?? ""}`}
          alt="show-backdrop"
          width={240}
          height={135}
          className="cursor-pointer transition-transform hover:scale-110"
        />
      ))}
    </main>
  )
}
