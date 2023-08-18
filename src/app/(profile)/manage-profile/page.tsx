import { Button } from "~/components/ui/button"
import { PlusCircle, ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { getAccountWithProfiles } from "~/lib/fetchers"

export default async function ManageProfilePage() {
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
          <h1 className="text-5xl">Manage Profiles</h1>
          <ul className="flex gap-4">
            {account.profiles.map((profile) => (
              <div key={profile.id} className="space-y-1.5">
                <Link
                  href={`/manage-profile/${profile.name}?profileId=${profile.id}`}
                  className="relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.profileImgPath}
                    alt="profile-image"
                    width="96"
                    height="96"
                  />
                  <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/25 hover:bg-transparent">
                    <Pencil />
                  </div>
                </Link>
                <h3 className="text-center">{profile.name}</h3>
              </div>
            ))}
            {account.profiles.length !== 4 && (
              <Link href="/manage-profile/add">
                <PlusCircle
                  className="h-24 w-24 bg-neutral-800 p-3 outline-1 hover:outline"
                  strokeWidth={1}
                />
              </Link>
            )}
          </ul>
        </section>
      </main>
    </>
  )
}
