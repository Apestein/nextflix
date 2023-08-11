import type { Stripe } from "stripe"
import { stripe } from "~/lib/stripe"
import { NextResponse } from "next/server"
import { db } from "~/db/client"
import { accounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { env } from "~/env.mjs"
import { raise, ERR } from "~/lib/utils"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
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
    console.log("Checkout Completed")
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    // Update the user stripe into in our database.
    await db
      .update(accounts)
      .set({ stripeCustomerId: subscription.customer as string })
      .where(eq(accounts.id, session.metadata?.userId ?? raise(ERR.undefined)))
  }

  // if (event.type === "invoice.payment_succeeded") {
  // }

  return NextResponse.json({ message: "Received" }, { status: 200 })
}
