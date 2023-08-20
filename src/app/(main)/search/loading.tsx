import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="mt-8">
      <Skeleton className="h-96 w-full" />
    </main>
  )
}
