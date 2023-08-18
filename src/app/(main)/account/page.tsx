import { CreditCard, ChevronRight } from "lucide-react"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { getAccountWithProfiles } from "~/lib/fetchers"

export default async function AccountPage() {
  const account = await getAccountWithProfiles()
  return (
    <main className="my-12 flex justify-center">
      <div className="space-y-5 md:min-w-[500px]">
        <section className="space-y-2">
          <h1 className="text-4xl">Account</h1>
          <p className="flex items-center gap-2 text-sm text-neutral-400">
            <CreditCard />
            Member Since: {account.createdAt.toDateString()}
          </p>
        </section>
        <div aria-label="divider" className="h-px w-full bg-white/25" />
        <p className="text-2xl text-neutral-400">MEMBERSHIP & BILLING</p>
        <p className="flex cursor-pointer justify-between">
          {account.email}
          <ChevronRight />
        </p>
        <div aria-label="divider" className="h-px w-full bg-white/25" />
        <p className="flex cursor-pointer justify-between">
          Update Account
          <ChevronRight />
        </p>
        <div aria-label="divider" className="h-px w-full bg-white/25" />
        <Button className="w-full" asChild>
          <Link href="/subscription">Manage Subscription</Link>
        </Button>
        <div aria-label="divider" className="h-px w-full bg-white/25" />
        <p className="text-2xl text-neutral-400">Plan Details</p>
        <p className="flex gap-1.5">
          {`${account.membership
            .charAt(0)
            .toUpperCase()}${account.membership.substring(1)}`}
          <span className="rounded-sm px-1 text-neutral-100 ring-2 ring-slate-100">
            4K+HDR
          </span>
        </p>
        <div aria-label="divider" className="h-px w-full bg-white/25" />
        <p className="flex cursor-pointer justify-between">
          Change plan
          <ChevronRight />
        </p>
        <div aria-label="divider" className="h-px w-full bg-white/25" />
        <p className="text-2xl text-neutral-400">Profiles</p>
        <div className="flex gap-5">
          {account.profiles.map((profile) => (
            <div key={profile.id} className="space-y-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.profileImgPath}
                width="100"
                height="100"
                alt="profile-img"
                className="rounded-lg"
              />
              <h3 className="text-center">{profile.name}</h3>
            </div>
          ))}
        </div>
        <div aria-label="divider" className="h-px w-full bg-white/25" />
      </div>
    </main>
  )
}
