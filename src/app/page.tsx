import { db } from "~/db/client"
import { playingWithNeon } from "~/db/schema"

export default async function Home() {
  const res = await db.select().from(playingWithNeon)
  console.log(res)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Demo
    </main>
  )
}
