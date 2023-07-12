import { db } from "~/db/client"
import { eq, lt, gte, ne } from "drizzle-orm"

export default function ShowPage() {
  return (
    <main className="">
      <iframe
        width="420"
        height="315"
        src="https://www.youtube.com/embed/tgbNymZ7vqY"
      />
    </main>
  )
}
