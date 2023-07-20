import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { ShowCard } from "~/components/show-card"

export default async function AccountPage() {
  const { userId } = auth()
  if (!userId) throw new Error("No userId")
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: {
      activeProfile: {
        with: {
          myShows: true,
        },
      },
    },
  })
  if (!userAccount) throw new Error("No Account")
  const myShows = userAccount.activeProfile.myShows
  return (
    <main className="flex gap-1.5 pt-3">
      {!myShows.length && "You have no saved shows yet."}
      {myShows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </main>
  )
}
