import { db } from "~/db/client"
import { playingWithNeon } from "~/db/schema"
import { env } from "~/env.mjs"
import { type Movie } from "~/types"
import Image from "next/image"

async function getData() {
  const res = await fetch(
    // `https://api.themoviedb.org/3/tv/popular?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US`
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${env.NEXT_PUBLIC_TMDB_API}&language=en-US&page=1`
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default async function Home() {
  // const res = await db.select().from(playingWithNeon)
  const data = (await getData()) as { results: Movie[] }
  return (
    <main className="flex min-h-screen justify-center">
      <div className="container flex flex-col border">
        {data.results.map((movie) => (
          <figure key={movie.id}>
            <h2>{movie.title}</h2>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path ?? ""}`}
              alt="movie-poster"
              width={200}
              height={600}
            />
          </figure>
        ))}
      </div>
    </main>
  )
}
