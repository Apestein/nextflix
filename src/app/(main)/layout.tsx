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
import { LinkButton } from "~/components/link-button"

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
          <Link href="/tv-shows">TV Shows</Link>
          <Link href="/movies">Movies</Link>
          <Link href="/new-and-popular">New & Popular</Link>
          <LinkButton href="/my-list">My List</LinkButton>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/search?keyword=">
          <Search />
        </Link>
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
import { ForceFresh } from "~/components/force-refresh"

async function CustomeUserButton() {
  const { userId } = auth()
  if (!userId) return
  const userAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: { activeProfile: true },
  })
  if (!userAccount) return <ForceFresh />
  return (
    <>
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
          <DropdownMenuLabel>
            {userAccount.activeProfile.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/manage-profile">Manage Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/switch-profile">Switch Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/account">Account</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/subscription">Subscription</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-center border">
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

function Footer() {
  return (
    <footer className="mt-auto pb-3 pt-12 text-sm">
      <i className="flex gap-3 py-3">
        <Link href="/">
          <Facebook className="hover:text-red-500" />
        </Link>
        <Link href="/" className="hover:text-red-500">
          <Instagram />
        </Link>
        <Link href="/" className="hover:text-red-500">
          <Twitter />
        </Link>
        <Link href="/" className="hover:text-red-500">
          <Youtube />
        </Link>
      </i>
      <div className="flex justify-between py-3 text-white/50">
        <div className="flex flex-col gap-3">
          <Link href="/">Audio Description</Link>
          <Link href="/">Investor Relations</Link>
          <Link href="/">Legal Notices</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/">Help Center</Link>
          <Link href="/">Jobs</Link>
          <Link href="/">Cookie Preferences</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/">Gift Cards</Link>
          <Link href="/">Terms of Use</Link>
          <Link href="/">Corporate Information</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/">Media Center</Link>
          <Link href="/">Privacy</Link>
          <Link href="/">Contact Us</Link>
        </div>
      </div>
      <div className="font-semibold">Copyright © 2023 Nextflix</div>
    </footer>
  )
}
