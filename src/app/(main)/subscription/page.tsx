import { Check } from "lucide-react"
import { PlanSelector } from "./plan-selector"
import { db } from "~/db/client"
import { eq } from "drizzle-orm"
import { accounts } from "~/db/schema"
import { auth } from "@clerk/nextjs"
import { ERR } from "~/lib/utils"

export default async function SubscriptionPage() {
  const { userId } = auth()
  if (!userId) throw new Error(ERR.unauthenticated)
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  })
  if (!userAccount) throw new Error(ERR.db)
  console.log(userAccount.membership)
  return (
    <main className="mx-auto mt-8 w-2/3 space-y-8">
      <h1 className="text-3xl font-bold sm:text-4xl">
        Choose the plan that&apos;s right for you
      </h1>
      <div className="space-y-3 text-zinc-400">
        <div className="flex gap-1.5">
          <Check stroke="red" />
          <p>Watch on your phone, tablet, laptop, and TV</p>
        </div>
        <div className="flex gap-1.5">
          <Check stroke="red" />
          <p>Unlimited movies and TV shows</p>
        </div>
        <div className="flex gap-1.5">
          <Check stroke="red" />
          <p>Change or cancel your plan anytime</p>
        </div>
      </div>
      <PlanSelector />
      <div className="space-y-3 text-sm text-zinc-300">
        <p>
          HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability subject
          to your internet service and device capabilities. Not all content is
          available in all resolutions. See our{" "}
          <span className="cursor-pointer text-blue-500">Terms of Use</span> for
          more details.
        </p>
        <p>
          Only people who live with you may use your account. Watch on 4
          different devices at the same time with Premium, 2 with Standard, and
          1 with Basic and Mobile.
        </p>
      </div>
    </main>
  )
}
