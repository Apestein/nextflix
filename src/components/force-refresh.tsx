"use client"
import { useRouter } from "next/navigation"
import { useRef } from "react"

export function ForceFresh() {
  const triedRef = useRef(0)
  const router = useRouter()
  triedRef.current += 1
  if (triedRef.current < 5) setTimeout(() => router.refresh(), 1000)
  return null
}
