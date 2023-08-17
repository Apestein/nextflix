"use client"
import type { Profile } from "~/lib/types"
import { useRouter } from "next/navigation"
import { useToast } from "~/components/ui/use-toast"
import { switchProfile } from "~/actions/safe-action"

export function ProfileSwitcher({ profile }: { profile: Profile }) {
  const router = useRouter()
  const { toast } = useToast()

  async function doSwitch() {
    const { data, validationError } = await switchProfile({
      profileId: profile.id,
    })
    toast({ description: data?.message ?? validationError?.profileId })
    if (data) router.replace("/")
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
