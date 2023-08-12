"use client"
import { cn } from "~/lib/utils"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import type { SubscriptionPlan, PlanName } from "~/types"
import { PLANS } from "~/lib/configs"
import { createCheckoutSession } from "~/lib/actions"
import { useZact } from "~/lib/zact/client"

export function PlanSelector({
  activeSubscription,
}: {
  activeSubscription: PlanName
}) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    Plans[activeSubscription],
  )
  const { execute } = useZact(createCheckoutSession)

  function submit() {
    void execute({
      stripeProductId: selectedPlan.id,
      planName: selectedPlan.name,
    })
  }

  return (
    <>
      <div className="flex justify-end gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "grid aspect-square w-28 cursor-pointer place-content-center rounded-lg font-semibold",
              selectedPlan.name === plan.name
                ? "bg-red-600"
                : "bg-red-900 hover:bg-red-700",
            )}
            onClick={() => setSelectedPlan(plan)}
          >
            {`${plan.name.charAt(0).toUpperCase()}${plan.name.substring(1)}`}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          className="w-56 bg-green-600 font-semibold text-white hover:bg-green-700"
          onClick={submit}
          disabled={
            selectedPlan.name === "free" && activeSubscription === "free"
              ? true
              : false
          }
        >
          {activeSubscription !== "free" ? "Edit" : "Subscribe"}
        </Button>
      </div>
    </>
  )
}

const Plans = {
  free: PLANS[0],
  basic: PLANS[1],
  standard: PLANS[2],
  premium: PLANS[3],
}
