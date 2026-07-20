import { ArrowLeftRight, Plus } from "lucide-react"

export const actionItems = [
  {
    key: "record",
    icon: Plus,
    link: "/transaction/new",
  },
  {
    key: "transfer",
    icon: ArrowLeftRight,
    link: "/transfer/new",
  },
] as const
