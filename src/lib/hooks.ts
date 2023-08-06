import useSWR from "swr"
import { env } from "~/env.mjs"
import type { ShowWithVideoAndGenre, Show } from "~/types"

export function useShowWithVideoAndGenre(show: Show) {
  const { data, isLoading, error } = useSWR<ShowWithVideoAndGenre, Error>(
    `https://api.themoviedb.org/3/movie/${show.id}?api_key=${env.NEXT_PUBLIC_TMDB_API}&append_to_response=videos,genres`,
    (url: string) => fetch(url).then((r) => r.json()),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return { data, isLoading, error }
}
