import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/60">
      <Skeleton className="absolute left-1/2 top-1/2 h-[50vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg" />
    </div>
  )
}
