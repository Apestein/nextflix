import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { Button } from "~/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ERR } from "~/lib/utils"
import { ProfileSwitcher } from "./profile-switcher"

export default async function SwitchProfilePage() {
  const { userId } = auth()
  if (!userId) throw new Error(ERR.unauthenticated)
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: { profiles: true },
  })
  if (!userAccount) throw new Error(ERR.db)
  return (
    <>
      <Button variant="outline" asChild className="absolute ml-6 mt-6">
        <Link href="/">
          <ArrowLeft />
        </Link>
      </Button>
      <main className="grid min-h-screen place-content-center">
        <section className="space-y-8">
          <h1 className="text-5xl">Who&apos;s Watching</h1>
          <ul className="flex gap-4">
            {userAccount.profiles.map((profile) => (
              <ProfileSwitcher key={profile.id} profile={profile} />
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
