import type { Stripe } from "stripe"
import { stripe } from "~/lib/stripe"
import { NextResponse } from "next/server"
import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { env } from "~/env.mjs"
import { raise, ERR } from "~/lib/utils"
import { planTuple } from "~/lib/configs"
import { z } from "zod"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.NODE_ENV === "production"
        ? env.STRIPE_WEBHOOK_SECRET
        : "whsec_c4aed9ff845d5c080f80706e999aafec5e49c958e4362a44d7c97df124478c54",
    )
  } catch (error) {
    return new Response(
      `Webhook Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 400 },
    )
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    console.log({ session })
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    // Update the user stripe into in our database.
    const userId = session.metadata?.userId ?? raise(ERR.undefined)
    const plan = session.metadata?.planName
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

  // if (event.type === "invoice.payment_succeeded") {
  // }

  return NextResponse.json({ message: "Received" }, { status: 200 })
}
