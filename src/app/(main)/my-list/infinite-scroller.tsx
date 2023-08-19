"use client"
import React, { useEffect, useRef } from "react"

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  fetchNextPage: () => void
  hasNextPage: boolean
  loadingMessage: React.ReactNode
  endingMessage: React.ReactNode
}
export function InfiniteScroller(props: InfiniteScrollProps) {
  const {
    fetchNextPage,
    hasNextPage,
    loadingMessage,
    endingMessage,
    children,
    ...rest
  } = props
  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage()
        }
      },
      { threshold: 1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget])

  return (
    <div
      {...rest}
      className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-5 [overflow-anchor:none]"
    >
      {children}
      <div ref={observerTarget}></div>
      {hasNextPage && loadingMessage}
      {!hasNextPage && endingMessage}
    </div>
  )
}
