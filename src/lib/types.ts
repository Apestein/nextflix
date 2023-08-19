import type { myShows, profiles } from "~/db/schema"
import type { InferModel } from "drizzle-orm"
import type { PLANS } from "~/lib/configs"

export type MyShow = InferModel<typeof myShows>
export type Profile = InferModel<typeof profiles>
export type SubscriptionPlan = (typeof PLANS)[number]
export type PlanName = (typeof PLANS)[number]["name"]

export interface Show {
  id: number
  backdrop_path: string
  poster_path: string
  title?: string
  name?: string
  overview: string
  vote_average: number
  popularity: number
  release_date?: string
  first_air_date?: string
}
export interface ShowWithVideoAndGenre extends Show {
  videos: {
    results: Video[]
  }
  genres: Genre[]
}

type Video = {
  key: string
  type: string
}

type Genre = {
  id: number
  name: string
}

// "adult": false,
// "backdrop_path": "/e2Jd0sYMCe6qvMbswGQbM0Mzxt0.jpg",
// "genre_ids": [
//   28,
//   80,
//   53
// ],
// "id": 385687,
// "original_language": "en",
// "original_title": "Fast X",
// "overview": "Over many missions and against impossible odds, Dom Toretto and his family have outsmarted, out-nerved and outdriven every foe in their path. Now, they confront the most lethal opponent they've ever faced: A terrifying threat emerging from the shadows of the past who's fueled by blood revenge, and who is determined to shatter this family and destroy everything—and everyone—that Dom loves, forever.",
// "popularity": 4654.279,
// "poster_path": "/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
// "release_date": "2023-05-17",
// "title": "Fast X",
// "video": false,
// "vote_average": 7.3,
// "vote_count": 2093
