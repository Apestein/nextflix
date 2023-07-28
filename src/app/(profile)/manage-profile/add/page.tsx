/* eslint-disable @next/next/no-img-element */
import { db } from "~/db/client"
import { accounts, profiles } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { Button } from "~/components/ui/button"
import Link from "next/link"

export default async function AddProfilePage() {
  const { userId } = auth()
  if (!userId) throw new Error("No userId")
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: { profiles: true },
  })
  if (!userAccount) throw new Error("No userAccount")

  async function addProfile(data: FormData) {
    "use server"
    if (!userAccount) throw new Error("No userAccount")
    const name = data.get("name") as string
    const profileImage = data.get("avatar") as string
    if (!name || !profileImage) return
    if (userAccount.profiles.length === 4) return
    await db.insert(profiles).values({
      id: `${userAccount.id}/${userAccount.profiles.length + 1}`,
      accountId: userAccount.id,
      name: name,
      profileImgPath: `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${profileImage}`,
    })
  }

  return (
    <main className="flex flex-col items-center gap-12 ">
      <div className="w-full space-y-3 border-b border-white/40 pb-3">
        <h1 className="text-5xl">Add Profile</h1>
        <p className="text-white/60">
          Add a profile for another person watching Netflix.
        </p>
      </div>
      <div>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          action={addProfile}
          id="add-profile-form"
          className="space-y-8"
        >
          <section className="flex gap-8">
            <label className="outline-2 [&:has(input:checked)]:outline">
              <img
                src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=Mimi`}
                alt="profile-image"
                width="96"
                height="96"
              />
              <input
                type="radio"
                name="avatar"
                value="Mimi"
                className="hidden"
              />
            </label>
            <label className="outline-2 [&:has(input:checked)]:outline">
              <img
                src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=Lucky`}
                alt="profile-image"
                width="96"
                height="96"
              />
              <input
                type="radio"
                name="avatar"
                value="Mimi"
                className="hidden"
              />
            </label>
            <label className="outline-2 [&:has(input:checked)]:outline">
              <img
                src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=Salem`}
                alt="profile-image"
                width="96"
                height="96"
              />
              <input
                type="radio"
                name="avatar"
                value="Mimi"
                className="hidden"
              />
            </label>
            <label className="outline-2 [&:has(input:checked)]:outline">
              <img
                src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=Tinkerbell`}
                alt="profile-image"
                width="96"
                height="96"
              />
              <input
                type="radio"
                name="avatar"
                value="Mimi"
                className="hidden"
              />
            </label>
            <label className="outline-2 [&:has(input:checked)]:outline">
              <img
                src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=Casper`}
                alt="profile-image"
                width="96"
                height="96"
              />
              <input
                type="radio"
                name="avatar"
                value="Mimi"
                className="hidden"
              />
            </label>
          </section>
          <input
            type="text"
            name="name"
            placeholder="name"
            className="w-full border border-white/40 p-1"
          />
        </form>
      </div>
      <section className="space-x-8">
        <Button form="add-profile-form" type="submit">
          Submit
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/manage-profile">Done</Link>
        </Button>
      </section>
    </main>
  )
}
