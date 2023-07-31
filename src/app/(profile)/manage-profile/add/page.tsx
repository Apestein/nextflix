"use client"
import { Button } from "~/components/ui/button"
import { addProfile } from "~/lib/actions"
import { useZact } from "~/lib/zact/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useRouter } from "next/navigation"

export default function AddProfilePage() {
  const [name, setName] = useState("")
  const { execute } = useZact(addProfile)
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
        placeholder="name"
        className="w-full border border-white/40 p-1"
        onChange={(e) => debounced(e.target.value)}
      />
      <section className="space-x-8">
        <Button
          onClick={() => {
            void execute({ name })
            router.replace("/manage-profile")
            router.refresh()
          }}
        >
          Save
        </Button>
      </section>
    </main>
  )
}
