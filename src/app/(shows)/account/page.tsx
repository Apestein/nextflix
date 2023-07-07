import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq, lt, gte, ne } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import Image from "next/image"
import { CreditCard, ChevronRight, PlusSquare } from "lucide-react"

export default async function AccountPage() {
  const { userId } = auth()
  console.log(userId)
  if (!userId) throw new Error("No userId")
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: { profiles: true },
  })
  if (!userAccount) throw new Error("No userAccount")
  return (
    <main>
      <div className="mx-auto w-1/2 space-y-5 py-10">
        <h1 className="text-4xl">Account</h1>
        <p className="flex items-center gap-2 text-sm text-white/50">
          <CreditCard />
          Member Since: {userAccount.createdAt.toDateString()}
        </p>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
        <p className="text-3xl text-white/50">Personal Info</p>
        <p className="flex cursor-pointer justify-between">
          Email: {userAccount.email}
          <ChevronRight stroke="white" opacity="0.5" />
        </p>
        <p>Card ending in: 0000</p>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
        <p className="text-3xl text-white/50">Plan Details</p>
        <p>You are currently not subsribed to any plan.</p>
        <p>{userAccount.membership ? userAccount.membership : "N/A"}</p>
        <div aria-label="divider" className="h-px w-full bg-white/50" />
        <p className="text-3xl text-white/50">Profiles</p>
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
          <PlusSquare width={100} height={100} className="cursor-pointer" />
        </div>
      </div>
    </main>
  )
}
