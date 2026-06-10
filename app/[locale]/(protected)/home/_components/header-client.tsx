"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function HeaderClient({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={cn(
        "sticky top-2 z-50 rounded-xl backdrop-blur-xl transition-all duration-300",
        scrolled
          ? "border bg-background/60 p-3 shadow-sm"
          : "bg-background pb-3"
      )}
    >
      {children}
    </div>
  )
}
