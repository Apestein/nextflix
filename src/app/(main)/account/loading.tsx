import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="my-12 flex justify-center">
      <Skeleton className="h-[50vh] w-[500px]" />
    </main>
  )
}
