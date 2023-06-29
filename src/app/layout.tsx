import "~/styles/globals.css"
import { Inter } from "next/font/google"
import Image from "next/image"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="flex justify-center">
          <div className="container flex gap-24 border p-3">
            <Image
              src={"netflix-logo.svg"}
              alt="netflix-logo"
              width={1024}
              height={276.74}
              className="h-auto w-28 transition-opacity hover:opacity-80 active:opacity-100"
            />
            <div className="flex gap-3">
              <p>Home</p>
              <p>TV Shows</p>
              <p>Movies</p>
              <p>New & Popular</p>
              <p>My List</p>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
