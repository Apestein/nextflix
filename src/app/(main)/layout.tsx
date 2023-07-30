export default function ShowsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container flex min-h-screen flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

import Image from "next/image"
import { Search, Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { SignedOut, SignedIn } from "@clerk/nextjs"

function Header() {
  return (
    <header className="flex h-16 justify-between">
      <div className="flex items-center gap-12">
        <Link href="/">
          <Image
            src="/netflix-logo.svg"
            alt="netflix-logo"
            width={1024}
            height={276.74}
            priority
            className="h-auto w-28 transition-opacity hover:opacity-80 active:opacity-100"
          />
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/">Home</Link>
          <p>TV Shows</p>
          <p>Movies</p>
          <p>New & Popular</p>
          <Link href="/my-list">
            <p>My List</p>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Search />
        <Bell />
        <SignedIn>
          <CustomeUserButton />
        </SignedIn>
        <SignedOut>
          <Button
            asChild
            className="bg-red-600 font-semibold text-white hover:bg-red-700 active:bg-red-800"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </SignedOut>
      </div>
    </header>
  )
}

import { auth, SignOutButton } from "@clerk/nextjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { db } from "~/db/client"
import { eq } from "drizzle-orm"
import { accounts } from "~/db/schema"
import { errors } from "~/lib/utils"

async function CustomeUserButton() {
  const { userId } = auth()
  if (!userId) throw new Error(errors.unauthenticated)
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: { activeProfile: true },
  })
  if (!userAccount) throw new Error(errors.db)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={userAccount.activeProfile.profileImgPath}
          alt="user-image"
          height="32"
          width="32"
          className="rounded-sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{userAccount.activeProfile.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/manage-profile">Manage Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Switch Profile</DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/account">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
        <DropdownMenuItem className="flex justify-center border">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

function Footer() {
  return (
    <footer className="mt-auto pb-3 pt-12 text-sm">
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
      <div className="font-semibold">Copyright © 2023 Nextflix</div>
    </footer>
  )
}
