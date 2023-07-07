export default function ShowsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

import Image from "next/image"
import { Search, Bell } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { UserButton, auth, SignedIn, SignedOut } from "@clerk/nextjs"

function Header() {
  const { userId } = auth()

  return (
    <header className="flex h-16 justify-between">
      <div className="flex items-center gap-12">
        <Image
          src={"netflix-logo.svg"}
          alt="netflix-logo"
          width={1024}
          height={276.74}
          priority
          className="h-auto w-28 transition-opacity hover:opacity-80 active:opacity-100"
        />
        <div className="flex gap-6 text-sm">
          <p>Home</p>
          <p>TV Shows</p>
          <p>Movies</p>
          <p>New & Popular</p>
          <p>My List</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Search />
        <Bell />
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-red-600 font-semibold text-white hover:bg-red-700 active:bg-red-800"
            )}
          >
            Sign In
          </Link>
        </SignedOut>
      </div>
    </header>
  )
}

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

function Footer() {
  return (
    <footer className="pt-12 text-sm">
      <i className="flex gap-3 py-3">
        <Facebook />
        <Instagram />
        <Twitter />
        <Youtube />
      </i>
      <div className="flex justify-between py-3 text-white/50">
        <div className="space-y-3">
          <p>Audio Description</p>
          <p>Investor Relations</p>
          <p>Legal Notices</p>
        </div>
        <div className="space-y-3">
          <p>Help Center</p>
          <p>Jobs</p>
          <p>Cookie Preferences</p>
        </div>
        <div className="space-y-3">
          <p>Gift Cards</p>
          <p>Terms of Use</p>
          <p>Corporate Information</p>
        </div>
        <div className="space-y-3">
          <p>Media Center</p>
          <p>Privacy</p>
          <p>Contact Us</p>
        </div>
      </div>
      <div className="py-3 font-semibold">Copyright © 2023 Nextflix</div>
    </footer>
  )
}
