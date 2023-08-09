"use client"
import { cn } from "~/lib/utils"
import { useState } from "react"
import { Button } from "~/components/ui/button"

export function PlanSelector() {
  const [selectedplan, setSelectedPlan] = useState<PlanNames>("premium")
  function submit() {
    console.log(selectedplan)
  }
  return (
    <>
      <div className="flex justify-end gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "grid aspect-square w-28 place-content-center rounded-lg font-semibold",
              selectedplan === plan.name ? "bg-red-600" : "bg-red-900",
            )}
            onClick={() => setSelectedPlan(plan.name)}
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

const plans = [
  {
    id: 0,
    name: "free",
    price: 0,
    description: "Free Video Stream",
  },
  {
    id: "price_1Nd71XBrDYSkolG53ADLYQXk",
    name: "basic",
    price: 5,
    description: "Basic Video Stream",
  },
  {
    id: "price_1Nd71ABrDYSkolG5kiBRhIHv",
    name: "standard",
    price: 10,
    description: "Standard Video Stream",
  },
  {
    id: "price_1Nd71XBrDYSkolG53ADLYQXk",
    name: "premium",
    price: 20,
    description: "Premium Video Stream",
  },
] as const
type PlanNames = (typeof plans)[number]["name"]
