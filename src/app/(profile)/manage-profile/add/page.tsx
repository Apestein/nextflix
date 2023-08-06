"use client"
import { Button } from "~/components/ui/button"
import { addProfile } from "~/lib/actions"
import { useZact } from "~/lib/zact/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useToast } from "~/components/ui/use-toast"
import { useEffect } from "react"

export default function AddProfilePage() {
  const [name, setName] = useState("")
  const { execute, data } = useZact(addProfile)
  const debounced = useDebouncedCallback((value: string) => {
    setName(value)
  }, 500)
  const router = useRouter()
  const { toast } = useToast()

  function doAdd() {
    void execute({ name })
    router.replace("/manage-profile")
    router.refresh()
  }

  useEffect(() => {
    if (data) toast({ description: data.message })
  }, [data])

  return (
    <>
      <Button variant="outline" asChild className="absolute ml-6 mt-6">
        <Link href="/manage-profile">
          <ArrowLeft />
        </Link>
      </Button>
      <main className="grid min-h-screen place-content-center place-items-center gap-y-8">
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
          width="135"
          height="135"
        />
        <input
          type="text"
          name="name"
          placeholder="name"
          className="w-full border border-white/40 p-1"
          onChange={(e) => debounced(e.target.value)}
        />
        <Button onClick={doAdd}>Save</Button>
      </main>
    </>
  )
}
