"use client"
import type { ShowWithVideoAndGenre } from "~/lib/types"
import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ModalCard } from "~/components/modal-card"

export function Modal({
  show,
  isSaved,
}: {
  show: ShowWithVideoAndGenre
  isSaved?: boolean
}) {
  const overlay = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const back = (e: KeyboardEvent) => e.key === "Escape" && router.back()
    document.addEventListener("keydown", back)
    return () => document.removeEventListener("keydown", back)
  }, [])

  return (
    <div
      ref={overlay}
      onClick={(e) => e.target === overlay.current && router.back()}
      className="fixed inset-0 bg-black/60"
      id="show-modal"
    >
      <ModalCard
        show={show}
        isSaved={isSaved}
        className="absolute left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  )
}
