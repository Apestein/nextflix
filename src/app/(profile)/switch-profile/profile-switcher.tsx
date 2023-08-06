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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={profile.profileImgPath}
      width="96"
      height="96"
      alt="profile-image"
      onClick={() => {
        void execute({ profileId: profile.id })
        router.replace("/")
        router.refresh()
        toast({
          title: "Action Completed",
          description: "Swtiched Profile",
        })
      }}
      className="cursor-pointer outline-1 hover:outline"
    />
  )
}
