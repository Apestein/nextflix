import { Check } from "lucide-react"
import { PlanSelector } from "./plan-selector"
import { getAccount } from "~/lib/fetchers"

export default async function SubscriptionPage() {
  const account = await getAccount()
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
      <PlanSelector activeSubscription={account.membership} />
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
