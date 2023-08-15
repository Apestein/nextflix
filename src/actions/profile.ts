"use server"

import { db } from "~/db/client"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { accounts, profiles } from "~/db/schema"
import { z } from "zod"
import { zact } from "~/lib/zact/server"
import { ERR } from "~/lib/utils"
import { revalidatePath } from "next/cache"

export const addProfile = zact(z.object({ name: z.string().min(2) }))(async (
  input,
) => {
  const userId = auth().userId
  if (!userId) throw new Error(ERR.unauthenticated)
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: {
      profiles: true,
    },
  })
  if (!userAccount) throw new Error(ERR.db)
  if (userAccount.profiles.length === 4) throw new Error(ERR.not_allowed)
  const takenProfileSlots = userAccount.profiles.map((profile) =>
    Number(profile.id.at(-1)),
  )
  const openProfileSlot = [1, 2, 3, 4].find(
    (el) => !takenProfileSlots.includes(el),
  )
  if (!openProfileSlot) throw new Error(ERR.undefined)
  await db.insert(profiles).values({
    id: `${userAccount.id}-${openProfileSlot}`,
    accountId: userAccount.id,
    name: input.name,
    profileImgPath: `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${input.name}`,
  })
  revalidatePath("/manage-profile")
  return { message: "Profile created" }
})

export const updateProfile = zact(
  z.object({ profileId: z.string(), name: z.string().min(3) }),
)(async (input) => {
  const userId = auth().userId
  if (!userId) throw new Error(ERR.unauthenticated)
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, input.profileId),
  })
  if (!profile) throw new Error(ERR.db)
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
})

export const switchProfile = zact(z.object({ profileId: z.string() }))(async (
  input,
) => {
  const userId = auth().userId
  if (!userId) throw new Error(ERR.unauthenticated)
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, input.profileId),
  })
  if (!profile) throw new Error(ERR.db)
  if (profile.accountId !== userId) throw new Error(ERR.unauthorized)
  await db
    .update(accounts)
    .set({
      activeProfileId: input.profileId,
    })
    .where(eq(accounts.id, userId))
  revalidatePath("/")
  return { message: "You have switched active profile" }
})

export const deleteProfile = zact(z.object({ profileId: z.string() }))(async (
  input,
) => {
  const userId = auth().userId
  if (!userId) throw new Error(ERR.unauthenticated)
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: {
      profiles: true,
    },
  })
  if (!account) throw new Error(ERR.db)
  if (account.activeProfileId === input.profileId)
    return { message: "Cannot delete active profile" }
  if (!account.profiles.find((profile) => profile.id === input.profileId))
    throw new Error(ERR.unauthorized)
  await db.delete(profiles).where(eq(profiles.id, input.profileId))
  revalidatePath("/manage-profile")
  return { message: "Profile Deleted" }
})
