"use client"
import { switchProfile } from "~/lib/actions"
import { useZact } from "~/lib/zact/client"
import type { Profile } from "~/types"
import { useRouter } from "next/navigation"
import { useToast } from "~/components/ui/use-toast"
import { useEffect } from "react"

export function ProfileSwitcher({ profile }: { profile: Profile }) {
  const router = useRouter()
  const { toast } = useToast()
  const { execute, data } = useZact(switchProfile)

  useEffect(() => {
    if (data) toast({ description: data.message })
  }, [data])

  function doSwitch() {
    void execute({ profileId: profile.id })
    router.replace("/")
    router.refresh()
  }

  return (
    <div className="space-y-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.profileImgPath}
        width="96"
        height="96"
        alt="profile-image"
        onClick={doSwitch}
        className="cursor-pointer outline-1 hover:outline"
      />
      <h3 className="text-center">{profile.name}</h3>
    </div>
  )
}
