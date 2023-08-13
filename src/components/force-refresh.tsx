"use client"
import { useRouter } from "next/navigation"
import { useRef } from "react"

export function ForceFresh() {
  const triedRef = useRef(0)
  console.log(triedRef.current)
  const router = useRouter()
  triedRef.current += 1
  if (triedRef.current < 5) setTimeout(() => router.refresh(), 2000)
  return null
}
