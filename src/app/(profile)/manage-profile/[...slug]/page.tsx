"use client"
import { Button } from "~/components/ui/button"
import * as sa from "~/lib/actions"
import { useZact } from "zact/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useRouter } from "next/navigation"
import { raise } from "~/lib/utils"

export default function ProfilePage({
  params,
  searchParams,
}: {
  params: { slug: string[] }
  searchParams: { profileId: string }
}) {
  const [name, setName] = useState(params.slug[0] ?? raise("No params"))
  const { mutate: mutateUpdate } = useZact(sa.updateProfile)
  const { mutate: mutateDelete } = useZact(sa.deleteProfile)
  const debounced = useDebouncedCallback((value: string) => {
    setName(value)
  }, 500)
  const router = useRouter()

  return (
    <main className="flex flex-col items-center gap-12 ">
      <div className="w-full space-y-3 border-b border-white/40 pb-3">
        <h1 className="text-5xl">Add Profile</h1>
        <p className="text-white/60">
          Add a profile for another person watching Netflix.
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
          onClick={() => {
            void mutateUpdate({
              name: name,
              profileId: searchParams.profileId,
            })
            router.replace("/manage-profile")
            router.refresh()
          }}
        >
          Update
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            void mutateDelete({
              profileId: searchParams.profileId,
            })
            router.replace("/manage-profile")
            router.refresh()
          }}
        >
          Delete
        </Button>
      </section>
    </main>
  )
}
