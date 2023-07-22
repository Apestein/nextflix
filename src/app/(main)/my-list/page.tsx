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
          profilesToMyShows: {
            with: {
              myShow: true,
            },
          },
        },
      },
    },
  })
  if (!userAccount) throw new Error("No Account")
  const savedShows = userAccount.activeProfile.profilesToMyShows
  return (
    <main className="flex gap-1.5 pt-3">
      {!savedShows.length && "You have no saved shows yet."}
      {savedShows.map((el) => (
        <ShowCard key={el.myShowId} show={el.myShow} />
      ))}
    </main>
  )
}
