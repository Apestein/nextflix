"use server"
import { z } from "zod"
import { action, authAction } from "./safe-action-client"
import { db } from "~/db/client"
import { eq } from "drizzle-orm"
import { accounts, profiles, myShows } from "~/db/schema"
import { ERR } from "~/lib/utils"
import { revalidatePath } from "next/cache"
import { getAccount, getAccountWithProfiles, getProfile } from "~/lib/fetchers"

export const createProfile = authAction(
  z.object({
    name: z.string().min(2).max(20),
  }),
  async (input, { userId }) => {
    const account = await getAccountWithProfiles(userId)
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
  async (input, { userId }) => {
    const account = await getAccountWithProfiles(userId)
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
  async (input, { userId }) => {
    const account = await getAccount(userId)
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

export const queryMyShow = authAction(
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
