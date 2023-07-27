/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs")

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["image.tmdb.org", "img.clerk.com", "api.dicebear.com"],
  },
  experimental: {
    serverActions: true,
  },
}

export default config
