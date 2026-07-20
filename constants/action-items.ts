import { ArrowLeftRight, WalletMinimal, type LucideIcon } from "lucide-react"

export const actionItems: {
  key: string
  icon: LucideIcon
  link: string
  color: string
}[] = [
  {
    key: "record",
    icon: WalletMinimal,
    link: "/transaction/new",
    color: "primary",
  },
  {
    key: "transfer",
    icon: ArrowLeftRight,
    link: "/transfer/new",
    color: "chart-2",
  },
]
