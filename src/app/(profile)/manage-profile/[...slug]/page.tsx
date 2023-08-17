"use client"
import { Button } from "~/components/ui/button"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useRouter } from "next/navigation"
import { useToast } from "~/components/ui/use-toast"
import { Input } from "~/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { deleteProfile, updateProfile } from "~/actions/safe-action"

export default function ProfilePage({
  params,
  searchParams,
}: {
  params: { slug: string[] }
  searchParams: { profileId: string }
}) {
  const [name, setName] = useState(params.slug[0]!)
  const debounced = useDebouncedCallback((value: string) => {
    setName(value)
  }, 500)
  const router = useRouter()
  const { toast } = useToast()

  async function doDelete() {
    const { data, validationError } = await deleteProfile({
      profileId: searchParams.profileId,
    })
    toast({
      description: data?.message ?? validationError?.profileId,
    })
    if (data) router.replace("/manage-profile")
  }

  async function doUpdate() {
    const { data, validationError } = await updateProfile({
      profileId: searchParams.profileId,
      name,
    })
    toast({
      description: data?.message ?? JSON.stringify(validationError, null, 4),
    })
    if (data) router.replace("/manage-profile")
  }

  return (
    <>
      <Button variant="outline" asChild className="absolute ml-6 mt-6">
        <Link href="/manage-profile">
          <ArrowLeft />
        </Link>
      </Button>
      <main className="grid min-h-screen place-content-center place-items-center gap-y-8">
        <div className="w-full space-y-3 border-b border-white/25 pb-3">
          <h1 className="text-5xl">Update Profile</h1>
          <p className="text-white/60">
            Update a profile with a new name and avatar.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${name}`}
          alt="profile-image"
          width="240"
          height="135"
        />
        <Input
          defaultValue={name}
          onChange={(e) => debounced(e.target.value)}
        />
        <section className="space-x-8">
          <Button
            className="bg-green-600 font-semibold text-white hover:bg-green-700 active:bg-green-800"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={doUpdate}
          >
            Update
          </Button>
          <Button
            className="bg-red-600 font-semibold text-white hover:bg-red-700 active:bg-red-800"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={doDelete}
          >
            Delete
          </Button>
        </section>
      </main>
    </>
  )
}
