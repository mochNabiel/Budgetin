"use client"

import { useEffect, useState } from "react"
import { cn } from "@/shared/utils"

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
    <header
      className={cn(
        "sticky top-2 z-50 rounded-full border-none backdrop-blur-xl transition-all duration-200",
        scrolled
          ? "border bg-background/70 px-4 py-2 shadow-sm"
          : "bg-background mb-3"
      )}
    >
      {children}
    </header>
  )
}
