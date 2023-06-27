import { db } from "~/db/client"
import { playingWithNeon } from "~/db/schema"
import { env } from "~/env.mjs"

async function getData() {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US`
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default async function Home() {
  const res = await db.select().from(playingWithNeon)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: any = await getData()
  console.log(data)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {res.map((el) => (
        <div key={el.id}>{el.value}</div>
      ))}
    </main>
  )
}
