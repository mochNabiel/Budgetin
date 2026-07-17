import { ArrowLeftRight, Plus } from "lucide-react"

export const actionItems = [
  {
    key: "record",
    icon: Plus,
    variant: "primary",
    link: "/transaction/new",
  },
  {
    key: "transfer",
    icon: ArrowLeftRight,
    variant: "default",
    link: "/transfer/new",
  },
] as const
