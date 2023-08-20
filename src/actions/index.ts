"use server"
import { z } from "zod"
import { authAction } from "./safe-action-client"
import { db } from "~/db/client"
import { eq } from "drizzle-orm"
import { accounts, profiles, myShows } from "~/db/schema"
import { ERR } from "~/lib/utils"
import { revalidatePath } from "next/cache"
import {
  getAccount,
  getAccountWithProfiles,
  getProfile,
  getAccountWithActiveProfile,
} from "~/lib/fetchers"
import { stripe } from "~/lib/stripe"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Stripe } from "stripe"
import { planTuple } from "~/lib/configs"

export const createProfile = authAction(
  z.object({
    name: z.string().min(2).max(20),
  }),
  async (input) => {
    const account = await getAccountWithProfiles()
    if (account.profiles.length === 4) throw new Error(ERR.not_allowed)
    const takenProfileSlots = account.profiles.map((profile) =>
      Number(profile.id.at(-1)),
    )
    const openProfileSlot = [1, 2, 3, 4].find(
      (el) => !takenProfileSlots.includes(el),
    )
    if (!openProfileSlot) throw new Error(ERR.undefined)
    await db.insert(profiles).values({
      id: `${account.id}-${openProfileSlot}`,
      accountId: account.id,
      name: input.name,
      profileImgPath: `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${input.name}`,
    })
    revalidatePath("/manage-profile")
    return { message: "Profile Created" }
  },
)

export const deleteProfile = authAction(
  z.object({
    profileId: z.string(),
  }),
  async (input) => {
    const account = await getAccountWithProfiles()
    if (account.activeProfileId === input.profileId)
      return { message: "Cannot delete active profile" }
    if (!account.profiles.find((profile) => profile.id === input.profileId))
      throw new Error(ERR.unauthorized)
    await db.delete(profiles).where(eq(profiles.id, input.profileId))
    revalidatePath("/manage-profile")
    return { message: "Profile Deleted" }
  },
)

export const updateProfile = authAction(
  z.object({
    profileId: z.string(),
    name: z.string().min(2).max(20),
  }),
  async (input, { userId }) => {
    const profile = await getProfile(input.profileId)
    if (userId !== profile.accountId) throw new Error(ERR.unauthorized)
    await db
      .update(profiles)
      .set({
        name: input.name,
        profileImgPath: `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${input.name}`,
      })
      .where(eq(profiles.id, input.profileId))
    revalidatePath("/manage-profile")
    return { message: "Profile Updated" }
  },
)

export const switchProfile = authAction(
  z.object({
    profileId: z.string(),
  }),
  async (input, { userId }) => {
    const profile = await getProfile(input.profileId)
    if (profile.accountId !== userId) throw new Error(ERR.unauthorized)
    await db
      .update(accounts)
      .set({
        activeProfileId: input.profileId,
      })
      .where(eq(accounts.id, userId))
    revalidatePath("/")
    return { message: "You have switched active profile" }
  },
)

export const toggleMyShow = authAction(
  z.object({
    id: z.number(),
    isSaved: z.boolean(),
    movieOrTv: z.enum(["movie", "tv"]),
  }),
  async (input) => {
    const account = await getAccount()
    if (!input.isSaved) {
      await db.insert(myShows).values({
        id: input.id,
        mediaType: input.movieOrTv,
        profileId: account.activeProfileId,
      })
      return { isSaved: true }
    } else {
      await db.delete(myShows).where(eq(myShows.id, input.id))
      return { isSaved: false }
    }
  },
)

export const getMyShowStatus = authAction(
  z.object({
    id: z.number(),
  }),
  async (input, { userId }) => {
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.id, userId),
      with: {
        activeProfile: {
          with: {
            savedShows: {
              where: eq(myShows.id, input.id),
              limit: 1,
            },
          },
        },
      },
    })
    if (!account) throw new Error(ERR.db)
    const showExist = !!account.activeProfile.savedShows.length
    return { isSaved: showExist }
  },
)

export const createCheckoutSession = authAction(
  z.object({
    stripeProductId: z.string(),
    planName: z.enum(planTuple),
  }),
  async (input, { userId }) => {
    const account = await getAccount()
    const siteUrl = headers().get("origin")!
    let checkoutSession: Stripe.Checkout.Session | Stripe.BillingPortal.Session
    if (input.planName !== "free" && account.membership === "free")
      checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: account.email,
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
        customer: account.stripeCustomerId!,
        return_url: `${siteUrl}/subscription`,
      })
    redirect(checkoutSession.url!)
  },
)

export const getMyShowsInfinite = authAction(
  z.object({
    index: z.number().min(0),
    limit: z.number().min(2).max(50),
  }),
  async (input) => {
    const account = await getAccountWithActiveProfile()
    const shows = await db.query.myShows.findMany({
      where: eq(myShows.profileId, account.activeProfileId),
      limit: input.limit,
      offset: input.index * input.limit,
    })
    return shows
  },
)
