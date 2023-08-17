/* eslint-disable @typescript-eslint/require-await */
import { createSafeActionClient } from "next-safe-action"
import { auth } from "@clerk/nextjs"
import { ERR } from "~/lib/utils"

export const action = createSafeActionClient()

export const authAction = createSafeActionClient({
  buildContext: async () => {
    const userId = auth().userId
    if (!userId) throw new Error(ERR.unauthenticated)
    return {
      userId,
    }
  },
})
