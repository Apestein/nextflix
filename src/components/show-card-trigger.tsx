import type { Show } from "~/lib/types"

export function ShowCardTrigger({ show }: { show: Show }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://image.tmdb.org/t/p/w300${
        show.backdrop_path ?? show.poster_path
      }`}
      alt="show-backdrop"
      width={300}
      height={169}
      className="aspect-video max-w-full cursor-pointer object-cover transition-transform hover:scale-110"
    />
  )
}
