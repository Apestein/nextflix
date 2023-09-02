"use client"

import { useEffect } from "react"
import { Button } from "~/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="container grid min-h-screen place-content-center space-y-5 text-center">
      <h1 className="text-3xl font-semibold">There was a problem</h1>
      <p>
        Currently is bug with connecting to Neon while database is idle, nothing
        I can do. Please refresh.
      </p>
      {/* <p>{error.message}</p> */}
      <section className="space-x-8">
        <Button onClick={() => reset()} className="font-semibold">
          Try again
        </Button>
        <Button asChild variant="secondary" className="font-semibold">
          <a href="/">Go back home</a>
        </Button>
      </section>
    </main>
  )
}
