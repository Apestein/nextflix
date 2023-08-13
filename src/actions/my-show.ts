"use server"

import { db } from "~/db/client"
import { myShows } from "~/db/schema"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { accounts } from "~/db/schema"
import { z } from "zod"
import { zact } from "~/lib/zact/server"
import { ERR } from "~/lib/utils"

export const toggleMyShow = zact(
  z.object({
    id: z.number(),
    isSaved: z.boolean(),
    movieOrTv: z.enum(["movie", "tv"]),
  }),
)(async (input) => {
  const userId = auth().userId
  if (!userId) throw new Error(ERR.unauthenticated)
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  })
  if (!userAccount) throw new Error(ERR.db)
  if (!input.isSaved)
    await db.insert(myShows).values({
      id: input.id,
      mediaType: input.movieOrTv,
      profileId: userAccount.activeProfileId,
    })
  else await db.delete(myShows).where(eq(myShows.id, input.id))
})

export const myShowQuery = zact(z.object({ id: z.number() }))(async (input) => {
  const { userId } = auth()
  if (!userId) return null
  const userAccount = await db.query.accounts.findFirst({
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
  if (!userAccount) throw new Error(ERR.db)
  const showExist = !!userAccount.activeProfile.savedShows.length
  return showExist
})
