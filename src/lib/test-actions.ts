import { zact } from "./zact/server"
import { z } from "zod"
export const validatedAction = zact(z.object({ id: z.string() }))(async (
  input,
) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${input.id}`,
  )
  if (!res.ok) throw new Error()
  const data = (await res.json()) as {
    userId: number
    id: number
    title: string
    body: string
  }
  return data
})
