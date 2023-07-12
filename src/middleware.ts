import { authMiddleware } from "@clerk/nextjs"
export default authMiddleware({
  publicRoutes: ["/", "/api/(.*)", "/show/(.*)"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
