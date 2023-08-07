"use client"
import { useRouter } from "next/navigation"

export function LinkButton({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  const router = useRouter()
  return (
    <button
      onClick={() => {
        router.push(href)
        router.refresh()
      }}
    >
      {children}
    </button>
  )
}
