import type { Stripe } from "stripe"
import { stripe } from "~/lib/stripe"
import { NextResponse } from "next/server"
import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { env } from "~/env.mjs"
import { planTuple } from "~/lib/configs"
import { z } from "zod"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.NODE_ENV === "production"
        ? env.STRIPE_WEBHOOK_SECRET
        : env.STRIPE_DEV_WEBHOOK_SECRET,
    )
  } catch (error) {
    return new Response(
      `Webhook Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 400 },
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    // Update the user stripe into in our database.
    const userId = session.metadata!.userId!
    const plan = session.metadata!.planName!
    const planSchema = z.enum(planTuple)
    const validatedPlan = planSchema.parse(plan)

    await db
      .update(accounts)
      .set({
        stripeCustomerId: subscription.customer as string,
        membership: validatedPlan,
      })
      .where(eq(accounts.id, userId))
  }

  if (event.type === "customer.subscription.updated") {
    const data = event.data.object as Stripe.Subscription
    if (data.canceled_at)
      await db
        .update(accounts)
        .set({ membership: "free" })
        .where(eq(accounts.stripeCustomerId, data.customer as string))
  }

  return NextResponse.json({ message: "Received" }, { status: 200 })
}
