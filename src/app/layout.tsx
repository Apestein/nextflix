import "~/lib/globals.css"
import { Inter } from "next/font/google"
import { cn } from "~/lib/utils"
import { ThemeProvider } from "~/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "~/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

// export const runtime = "edge"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Nextflix",
  description: "Open source Netflix clone project.",
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
