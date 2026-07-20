"use client"

import formatCurrency from "@/shared/helper/format-currency"
import { useBalanceVisibility } from "@/shared/store/use-balance-visibility"

interface Props {
  amount: number
  currency: string
  placeholder?: string
}

export default function BalanceText({
  amount,
  currency,
  placeholder = "••••••••",
}: Props) {
  const { hidden } = useBalanceVisibility()

  if (hidden) {
    return <>{placeholder}</>
  }

  return <>{formatCurrency(amount, currency)}</>
}
