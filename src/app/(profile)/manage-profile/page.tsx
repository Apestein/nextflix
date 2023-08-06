import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { Button } from "~/components/ui/button"
import { PlusCircle, ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { ERR } from "~/lib/utils"

export default async function ManageProfilePage() {
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
          <h1 className="text-5xl">Manage Profiles</h1>
          <ul className="flex gap-4">
            {userAccount.profiles.map((profile) => (
              <div key={profile.id} className="space-y-1.5">
                <Link
                  href={`/manage-profile/${profile.name}?profileId=${profile.id}`}
                  className="relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.profileImgPath}
                    alt="profile-image"
                    width="96"
                    height="96"
                  />
                  <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/25 hover:bg-transparent">
                    <Pencil />
                  </div>
                </Link>
                <h3 className="text-center">{profile.name}</h3>
              </div>
            ))}
            {userAccount.profiles.length !== 4 && (
              <Link href="/manage-profile/add">
                <PlusCircle
                  className="h-24 w-24 bg-neutral-800 p-3 outline-1 hover:outline"
                  strokeWidth={1}
                />
              </Link>
            )}
          </ul>
        </section>
      </main>
    </>
  )
}
