import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="mx-auto mt-8 w-2/3 space-y-8">
      <Skeleton className="h-[508px] w-[831px]" />
    </main>
  )
}
