"use client"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useToast } from "~/components/ui/use-toast"
import { createProfile } from "~/actions"

export default function AddProfilePage() {
  const [name, setName] = useState("")
  const debounced = useDebouncedCallback((value: string) => {
    setName(value)
  }, 500)
  const router = useRouter()
  const { toast } = useToast()

  async function doAdd() {
    const { data, validationError } = await createProfile({ name })
    toast({
      description:
        data?.message ?? validationError?.name ?? "Name must be unique",
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
        <div className="w-full space-y-3 border-b border-white/25 pb-3 text-center">
          <h1 className="text-3xl md:text-5xl">Add Profile</h1>
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
        <Input placeholder="name" onChange={(e) => debounced(e.target.value)} />
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onClick={doAdd}>Save</Button>
      </main>
    </>
  )
}
