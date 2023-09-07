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
  Home,
  Clapperboard,
  Film,
  TrendingUp,
  List,
  Pencil,
  ArrowLeftRight,
  User,
  BadgeCheck,
} from "lucide-react"
import { LinkButton } from "~/components/link-button"
import { getAccountWithActiveProfile } from "~/lib/server-fetchers"
import { OverlayScrollbar } from "~/components/overlay-scrollbar"

export default function ShowsLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="container flex min-h-screen flex-col px-4 md:px-8">
      <Header />
      {children}
      {modal}
      <Footer />
      <OverlayScrollbar />
    </div>
  )
}

const NAVINFO = [
  { name: "Home", href: "/", icon: <Home className="w-5" /> },
  {
    name: "TV Shows",
    href: "/tv-shows",
    icon: <Clapperboard className="w-5" />,
  },
  { name: "Movies", href: "/movies", icon: <Film className="w-5" /> },
  {
    name: "New & Popular",
    href: "/new-and-popular",
    icon: <TrendingUp className="w-5" />,
  },
  { name: "My List", href: "/my-list", icon: <List className="w-5" /> },
]

function Header() {
  return (
    <header className="flex h-16 justify-between">
      <div className="flex items-center gap-12">
        <Link href="/" className="hidden md:block">
          <Image
            src="/netflix-logo.svg"
            alt="netflix-logo"
            width={300}
            height={81}
            priority
            className="h-auto w-28 transition-opacity hover:opacity-80 active:opacity-100"
          />
        </Link>
        <MainMenu />
        <nav className="hidden gap-6 text-sm md:flex">
          {NAVINFO.map((el) =>
            el.name === "My List" ? (
              <LinkButton href={el.href} key={el.name}>
                {el.name}
              </LinkButton>
            ) : (
              <Link href={el.href} key={el.name}>
                {el.name}
              </Link>
            ),
          )}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/search?keyword=" aria-label="search">
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
    <DropdownMenu modal={false}>
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
          <Link className="flex gap-1.5" href="/manage-profile">
            <Pencil className="w-5" />
            Manage Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="flex gap-1.5" href="/switch-profile">
            <ArrowLeftRight className="w-5" />
            Switch Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="flex gap-1.5" href="/account">
            <User className="w-5" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="flex gap-1.5" href="/subscription">
            <BadgeCheck className="w-5" />
            Subscription
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutButton>
            <Button className="w-full font-semibold">Sign Out</Button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MainMenu() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex items-center gap-1.5 md:hidden">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-600">
          <path
            fill="currentColor"
            d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z"
          ></path>
        </svg>
        <h2 className="font-semibold">Menu</h2>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex gap-1.5">
          <svg viewBox="0 0 24 24" className="w-5 text-red-600">
            <path
              fill="currentColor"
              d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z"
            ></path>
          </svg>
          Netflix
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {NAVINFO.map((el) => (
          <DropdownMenuItem key={el.name} className="gap-1.5">
            {el.icon}
            <Link href={el.href}>{el.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Footer() {
  return (
    <footer className="mt-auto pb-3 pt-12 text-sm">
      <i className="flex gap-3 py-3">
        <Link href="/" aria-label="facebook">
          <Facebook className="hover:text-red-500" />
        </Link>
        <Link href="/" className="hover:text-red-500" aria-label="instagram">
          <Instagram />
        </Link>
        <Link href="/" className="hover:text-red-500" aria-label="twitter">
          <Twitter />
        </Link>
        <Link href="/" className="hover:text-red-500" aria-label="youtube">
          <Youtube />
        </Link>
      </i>
      <div className="grid grid-cols-2 justify-between gap-y-3 py-3 text-xs text-white/50 md:flex md:text-sm">
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
        user.username ?? user.firstName!
      }`,
      name: user.username ?? user.firstName!,
    })
    .onConflictDoNothing()
  return getAccountWithActiveProfile()
}
