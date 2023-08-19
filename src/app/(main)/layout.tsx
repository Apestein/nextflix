import Image from "next/image"
import Link from "next/link"
import { currentUser, SignedOut, auth, SignOutButton } from "@clerk/nextjs"
import { Suspense } from "react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Skeleton } from "~/components/ui/skeleton"
import { db } from "~/db/client"
import { accounts, profiles } from "~/db/schema"
import { eq } from "drizzle-orm"
import { ERR } from "~/lib/utils"
import {
  Search,
  Bell,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react"
import { LinkButton } from "~/components/link-button"
import { getAccountWithActiveProfile } from "~/lib/fetchers"

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
          <Link href="/">Movies</Link>
          <Link href="/new-and-popular">New & Popular</Link>
          <LinkButton href="/my-list">My List</LinkButton>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/search?keyword=">
          <Search />
        </Link>
        <Bell />
        <Suspense fallback={<Skeleton className="h-8 w-8" />}>
          <CustomeUserButton />
        </Suspense>
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

async function CustomeUserButton() {
  const { userId } = auth()
  if (!userId) return
  const existingAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
    with: { activeProfile: true },
  })
  const account = existingAccount ?? (await createAccountAndProfile())
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={account.activeProfile.profileImgPath}
          alt="user-image"
          height="32"
          width="32"
          className="rounded-sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{account.activeProfile.name}</DropdownMenuLabel>
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
  )
}

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
      <div className="text-center font-semibold text-neutral-300">
        Built by Apestein. The source code is available on&nbsp;
        <a
          href="https://github.com/Apestein/nextflix"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Github
        </a>
      </div>
    </footer>
  )
}

async function createAccountAndProfile() {
  const user = await currentUser()
  if (!user) throw new Error(ERR.unauthenticated)
  await db
    .insert(accounts)
    .values({
      id: user.id,
      email: user.emailAddresses[0]!.emailAddress,
      activeProfileId: user.id + "-1",
    })
    .onConflictDoNothing()
  await db
    .insert(profiles)
    .values({
      id: user.id + "-1",
      accountId: user.id,
      profileImgPath: `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${
        user.username ?? `${user.firstName!}_${user.lastName!}`
      }`,
      name: user.username ?? `${user.firstName!} ${user.lastName!}`,
    })
    .onConflictDoNothing()
  return getAccountWithActiveProfile()
}
