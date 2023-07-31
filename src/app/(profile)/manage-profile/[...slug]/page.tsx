"use client"
import { Button } from "~/components/ui/button"
import * as sa from "~/lib/actions"
import { useZact } from "~/lib/zact/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useRouter } from "next/navigation"
import { raise, ERR } from "~/lib/utils"
import { useToast } from "~/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage({
  params,
  searchParams,
}: {
  params: { slug: string[] }
  searchParams: { profileId: string }
}) {
  const [name, setName] = useState(params.slug[0] ?? raise(ERR.undefined))
  const { execute: executeUpdate } = useZact(sa.updateProfile)
  const { execute: executeDelete } = useZact(sa.deleteProfile)
  const debounced = useDebouncedCallback((value: string) => {
    setName(value)
  }, 500)
  const router = useRouter()
  const { toast } = useToast()

  return (
    <>
      <Button variant="outline" asChild className="absolute ml-6 mt-6">
        <Link href="/manage-profile">
          <ArrowLeft />
        </Link>
      </Button>
      <main className="grid min-h-screen place-content-center place-items-center gap-y-8">
        <div className="w-full space-y-3 border-b border-white/40 pb-3">
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
        <input
          type="text"
          name="name"
          defaultValue={name}
          className="w-full border border-white/40 p-1"
          onChange={(e) => debounced(e.target.value)}
        />
        <section className="space-x-8">
          <Button
            className="bg-green-600 font-semibold text-white hover:bg-green-700 active:bg-green-800"
            onClick={() => {
              void executeUpdate({
                name: name,
                profileId: searchParams.profileId,
              })
              router.replace("/manage-profile")
              router.refresh()
              toast({
                title: "Action Completed",
                description: "Updated profile",
              })
            }}
          >
            Update
          </Button>
          <Button
            className="bg-red-600 font-semibold text-white hover:bg-red-700 active:bg-red-800"
            onClick={() => {
              void executeDelete({
                profileId: searchParams.profileId,
              })
              router.replace("/manage-profile")
              router.refresh()
              toast({
                title: "Action Completed",
                description: "Deleted profile",
              })
            }}
          >
            Delete
          </Button>
        </section>
      </main>
    </>
  )
}
