import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq, lt, gte, ne } from "drizzle-orm"
import { auth } from "@clerk/nextjs"

export default async function AccountPage() {
  const { userId } = auth()
  if (!userId) throw new Error("No userId")
  const accountsArray = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, userId))
  const userAccount = accountsArray[0]
  return (
    <main className="container">
      <div>Member Since: {userAccount?.createdAt?.toDateString()}</div>
      <div>Email: {userAccount?.email}</div>
      <div>
        Membership: {userAccount?.membership ? userAccount.membership : "N/A"}
      </div>
    </main>
  )
}
