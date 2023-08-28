import { Button } from "~/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProfileSwitcher } from "./profile-switcher"
import { getAccountWithProfiles } from "~/lib/server-fetchers"

export default async function SwitchProfilePage() {
  const account = await getAccountWithProfiles()
  return (
    <>
      <Button variant="outline" asChild className="absolute ml-6 mt-6">
        <Link href="/">
          <ArrowLeft />
        </Link>
      </Button>
      <main className="grid min-h-screen place-content-center">
        <section className="space-y-8">
          <h1 className="text-center text-3xl md:text-5xl">
            Who&apos;s Watching
          </h1>
          <ul className="grid grid-cols-2 gap-4 md:flex">
            {account.profiles.map((profile) => (
              <ProfileSwitcher key={profile.id} profile={profile} />
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
