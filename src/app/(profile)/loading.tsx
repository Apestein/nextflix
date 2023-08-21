import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="grid min-h-screen place-content-center">
      <Skeleton className="h-[50vh] w-[98vw] md:w-[500px]" />
    </main>
  )
}
