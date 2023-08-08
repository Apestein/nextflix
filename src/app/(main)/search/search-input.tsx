"use client"
import { Input } from "~/components/ui/input"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useRouter } from "next/navigation"

interface PageProps extends React.HTMLAttributes<HTMLElement> {
  initialQuery: string
}
export function SearchInput({ initialQuery, ...props }: PageProps) {
  const [query, setQuery] = useState("")
  const debounced = useDebouncedCallback((value: string) => {
    setQuery(value)
  }, 500)
  const router = useRouter()

  useEffect(() => {
    if (query) router.replace(`/search?keyword=${query}`)
  }, [query])
  return (
    <Input
      placeholder="search keyword"
      defaultValue={initialQuery}
      onChange={(e) => debounced(e.target.value)}
      autoFocus
      {...props}
    />
  )
}
