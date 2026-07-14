// hooks/use-countdown.ts
"use client"

import { useEffect, useMemo, useState } from "react"

let sharedTimeLeft: number | null = null

export function useCountdown(initialSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(() => sharedTimeLeft ?? initialSeconds)

  useEffect(() => {
    sharedTimeLeft = timeLeft

    if (timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0")
    const seconds = String(timeLeft % 60).padStart(2, "0")

    return `${minutes}:${seconds}`
  }, [timeLeft])

  const reset = () => {
    setTimeLeft(initialSeconds)
    sharedTimeLeft = initialSeconds
  }

  return {
    timeLeft,
    formattedTime,
    isExpired: timeLeft <= 0,
    reset,
  }
}
