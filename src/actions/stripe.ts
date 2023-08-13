"use server"

import { db } from "~/db/client"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { accounts } from "~/db/schema"
import { z } from "zod"
import { zact } from "~/lib/zact/server"
import { ERR } from "~/lib/utils"
import { stripe } from "~/lib/stripe"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Stripe } from "stripe"
import { planTuple } from "~/lib/configs"

export const createCheckoutSession = zact(
  z.object({
    stripeProductId: z.string(),
    planName: z.enum(planTuple),
  }),
)(async (input) => {
  const userId = auth().userId
  if (!userId) throw new Error(ERR.unauthenticated)
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  })
  if (!userAccount) throw new Error(ERR.db)

  const siteUrl = headers().get("origin")!
  let checkoutSession: Stripe.Checkout.Session | Stripe.BillingPortal.Session
  if (input.planName !== "free" && userAccount.membership === "free")
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: userAccount.email,
      line_items: [
        {
          price: input.stripeProductId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/subscription/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/subscription`,
      metadata: {
        userId,
        planName: input.planName,
      },
    })
  else
    checkoutSession = await stripe.billingPortal.sessions.create({
      customer: userAccount.stripeCustomerId!,
      return_url: `${siteUrl}/subscription`,
    })
  redirect(checkoutSession.url!)
})
