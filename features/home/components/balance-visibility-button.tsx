"use client"

import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBalanceVisibility } from "@/shared/store/use-balance-visibility"

export default function BalanceVisibilityButton() {
  const { hidden, toggle } = useBalanceVisibility()

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      {hidden ? (
        <EyeOff className="text-primary-foreground" />
      ) : (
        <Eye className="text-primary-foreground" />
      )}
    </Button>
  )
}
