import { authMiddleware } from "@clerk/nextjs"
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/(.*)",
    "/show/(.*)",
    "/tv-shows",
    "/movies",
    "/new-and-popular",
    "/search(.*)",
  ],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
