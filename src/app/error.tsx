"use client"

import Link from "next/link"
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
    <main className="grid min-h-screen place-content-center space-y-5 text-center">
      <h1 className="text-3xl font-semibold">There was a problem</h1>
      <p>{error.message}</p>
      <section className="space-x-8">
        <Button onClick={() => reset()} className="font-semibold">
          Try again
        </Button>
        <Button asChild variant="secondary" className="font-semibold">
          <Link href="/">Go back home</Link>
        </Button>
      </section>
    </main>
  )
}
