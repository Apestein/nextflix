import "~/lib/globals.css"
import { Inter } from "next/font/google"
import { cn } from "~/lib/utils"
import { ThemeProvider } from "~/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "~/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

const siteConfig = {
  name: "Nextflix",
  description:
    "Open source project using bleeding-edge stack. Drizzle ORM + Neon postgres + Clerk auth + Shadcn/ui + everything new in Next.js 13 (server components, server actions, streaming ui, parallel routes, intercepting routes).",
}
export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-neutral-900 text-slate-50 antialiased",
            inter.className,
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
