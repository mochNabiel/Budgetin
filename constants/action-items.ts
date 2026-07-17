import {
  ArrowLeftRight,
  Plus,
} from "lucide-react"

export const actionItems = [
  {
    key: "record",
    icon: Plus,
    variant: "primary",
  },
  {
    key: "transfer",
    icon: ArrowLeftRight,
    variant: "default",
  },
] as const