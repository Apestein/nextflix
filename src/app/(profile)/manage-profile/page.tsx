import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { Button } from "~/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function ManageProfilePage() {
  const { userId } = auth()
  if (!userId) throw new Error("No userId")
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: { profiles: true },
  })
  if (!userAccount) throw new Error("No userAccount")
  return (
    <main className="flex flex-col items-center gap-12 ">
      <h1 className="text-5xl">Manage Profiles</h1>
      <ul className="flex gap-4">
        {userAccount.profiles.map((profile) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={profile.id}
            src={profile.profileImgPath}
            alt="profile-image"
            width="96"
            height="96"
          />
        ))}
        <Link href="/manage-profile/add">
          <PlusCircle
            className="h-24 w-24 border bg-neutral-800 p-3"
            strokeWidth={1}
          />
        </Link>
      </ul>
      <Button>Done</Button>
    </main>
  )
}
