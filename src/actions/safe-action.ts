"use server"
import { z } from "zod"
import { action, authAction } from "./safe-action-client"
import { db } from "~/db/client"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { accounts, profiles } from "~/db/schema"
import { ERR } from "~/lib/utils"
import { revalidatePath } from "next/cache"

function getAccount(include: string) {
  // switch(with) {
  //   case "active_profile":
  //     const userAccount = await db.query.accounts.findFirst({
  //       where: eq(accounts.id, userId),
  //       with: {
  //         profiles: true,
  //       },
  //     })
  //     if (!userAccount) throw new Error(ERR.db)
  //     return userAccount
  //     break;
  // }
  return false
}

export const createProfile = authAction(
  z.object({
    name: z.string().min(2).max(20),
  }),
  async (input, { userId }) => {
    const userAccount = await db.query.accounts.findFirst({
      where: eq(accounts.id, userId),
      with: {
        profiles: true,
      },
    })
    if (!userAccount) throw new Error(ERR.db)
    return { message: "Profile created" }
  },
)

// export const addProfile = zact(z.object({ name: z.string().min(2) }))(async (
//   input,
// ) => {
//   const userId = auth().userId
//   if (!userId) throw new Error(ERR.unauthenticated)
//   const userAccount = await db.query.accounts.findFirst({
//     where: eq(accounts.id, userId),
//     with: {
//       profiles: true,
//     },
//   })
//   if (!userAccount) throw new Error(ERR.db)
//   if (userAccount.profiles.length === 4) throw new Error(ERR.not_allowed)
//   const takenProfileSlots = userAccount.profiles.map((profile) =>
//     Number(profile.id.at(-1)),
//   )
//   const openProfileSlot = [1, 2, 3, 4].find(
//     (el) => !takenProfileSlots.includes(el),
//   )
//   if (!openProfileSlot) throw new Error(ERR.undefined)
//   await db.insert(profiles).values({
//     id: `${userAccount.id}-${openProfileSlot}`,
//     accountId: userAccount.id,
//     name: input.name,
//     profileImgPath: `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${input.name}`,
//   })
//   revalidatePath("/manage-profile")
//   return { message: "Profile created" }
// })
