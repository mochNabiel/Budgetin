"use client"

import { useSearchParams } from "next/navigation"

export function useTransactionDialog() {
  const searchParams = useSearchParams()

  const value = searchParams.get("open-transaction")

  return {
    isOpen: !!value,
    isCreate: value === "new",
    transactionId: value && value !== "new" ? value : null,
  }
}
