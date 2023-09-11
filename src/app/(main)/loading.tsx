import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
  return (
    <main>
      <div className="space-y-10">
        <Skeleton className="my-16 h-[250px] w-full max-w-lg md:h-[384px]" />
        <Skeleton className="h-[138px] w-full" />
        <Skeleton className="h-[138px] w-full" />
        <Skeleton className="h-[138px] w-full" />
      </div>
    </main>
  )
}
