import { authMiddleware } from "@clerk/nextjs"
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/(.*)",
    "/show/(.*)",
    "/tv-shows",
    "/movies",
    "/new-and-popular",
  ],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
