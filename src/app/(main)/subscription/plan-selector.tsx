"use client"
import { cn } from "~/lib/utils"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import type { SubscriptionPlan } from "~/types"
import { PLANS } from "~/lib/configs"
import { createCheckoutSession } from "~/lib/actions"
import { useZact } from "~/lib/zact/client"

export function PlanSelector() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(PLANS[3])
  const { execute } = useZact(createCheckoutSession)

  function submit() {
    void execute({ stripeProductId: selectedPlan.id })
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
            {plan.name}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-green-600 font-semibold text-white hover:bg-green-700"
          onClick={submit}
        >
          Subscribe
        </Button>
      </div>
    </>
  )
}
