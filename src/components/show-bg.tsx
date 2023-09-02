import { type Show } from "~/lib/types"
import Image from "next/image"

export function ShowBg({ show }: { show: Show }) {
  return (
    <div
      aria-label="background"
      className="absolute inset-0 -z-10 h-screen w-full"
    >
      <div className="h-full w-full bg-black/60 bg-gradient-to-b from-neutral-900/0 to-neutral-900" />
      <Image
        src={`https://image.tmdb.org/t/p/original/${show.backdrop_path}`}
        alt="background-image"
        className="-z-10 object-cover"
        fill
        priority
      />
    </div>
  )
}
