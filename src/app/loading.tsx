import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container">
      <div className="flex h-96 flex-col justify-center">
        <Skeleton className="h-3/4 w-1/2" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-[173px] w-full" />
        <Skeleton className="h-[173px] w-full" />
        <Skeleton className="h-[173px] w-full" />
        {/* <Skeleton className="h-[173px] w-full" />
        <Skeleton className="h-[173px] w-full" />
        <Skeleton className="h-[173px] w-full" /> */}
      </div>
    </div>
  )
}
