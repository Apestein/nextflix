"use client"
import { switchProfile } from "~/lib/actions"
import { useZact } from "~/lib/zact/client"
import type { Profile } from "~/types"
import { useRouter } from "next/navigation"
import { useToast } from "~/components/ui/use-toast"

export function ProfileSwitcher({ profile }: { profile: Profile }) {
  const router = useRouter()
  const { toast } = useToast()
  const { execute } = useZact(switchProfile)

  async function doSwitch() {
    const res = await execute({ profileId: profile.id })
    toast({ description: res?.message })
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={doSwitch}
        className="cursor-pointer outline-1 hover:outline"
      />
      <h3 className="text-center">{profile.name}</h3>
    </div>
  )
}
