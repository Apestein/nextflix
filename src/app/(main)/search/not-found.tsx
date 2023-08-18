import { Button } from "~/components/ui/button"

export default function NotFound() {
  return (
    <main className="grid grow place-content-center space-y-5 text-center">
      <h2 className="text-3xl font-semibold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Button asChild variant="outline" className="font-semibold">
        <a href="/search">Return to search</a>
      </Button>
    </main>
  )
}
