import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import Image from "next/image"
import { CreditCard, ChevronRight } from "lucide-react"

export default async function AccountPage() {
  const { userId } = auth()
  if (!userId) throw new Error("No userId")
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: { profiles: true },
  })
  if (!userAccount) throw new Error("No userAccount")
  return (
    <main className="flex justify-center">
      <div className="w-1/2 max-w-xl space-y-5 py-12">
        <section className="space-y-2">
          <h1 className="text-4xl">Account</h1>
          <p className="flex items-center gap-2 text-sm text-white/50">
            <CreditCard />
            Member Since: {userAccount.createdAt.toDateString()}
          </p>
        </section>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
        <p className="text-2xl text-white/50">MEMBERSHIP & BILLING</p>
        <p className="flex cursor-pointer justify-between">
          {userAccount.email}
          <ChevronRight stroke="white" opacity="0.5" />
        </p>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
        <p className="flex cursor-pointer justify-between">
          Update Account
          <ChevronRight stroke="white" opacity="0.5" />
        </p>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
        <p>
          {userAccount.membership ??
            " You are currently not subsribed to any plan."}
        </p>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
        <p className="text-2xl text-white/50">Plan Details</p>
        <p>{userAccount.membership ? userAccount.membership : "None Member"}</p>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
        <p className="flex cursor-pointer justify-between">
          Change plan
          <ChevronRight stroke="white" opacity="0.5" />
        </p>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
        <p className="text-2xl text-white/50">Profiles</p>
        <div className="flex gap-5">
          {userAccount.profiles.map((profile) => (
            <Image
              key={profile.id}
              src={profile.profileImgPath}
              width={100}
              height={100}
              alt="profile-img"
              className="rounded-lg"
            />
          ))}
        </div>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
      </div>
    </main>
  )
}
