"use client"
import { useOverlayScrollbars } from "overlayscrollbars-react"
import { useEffect } from "react"

export function OverlayScrollbar() {
  const [initBodyOverlayScrollbars] = useOverlayScrollbars({
    defer: true,
    options: {
      scrollbars: {
        theme: "os-theme-light",
        autoHide: "scroll",
      },
    },
  })

  useEffect(() => {
    //only run on none touch screen devices
    if (window.matchMedia("(hover: hover)").matches)
      initBodyOverlayScrollbars(document.body)
  }, [initBodyOverlayScrollbars])

  return null
}
