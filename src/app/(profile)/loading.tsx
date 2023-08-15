import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="grid min-h-screen place-content-center">
      <Skeleton className="h-52 w-[500px]" />
    </main>
  )
}
