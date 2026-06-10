import {
  Home,
  Sparkles,
  LayoutGrid,
  Settings,
  Crown,
  Wallet,
} from "lucide-react"

export const sidebarItems = [
  {
    key: "home",
    href: "/home",
    icon: Home,
  },
  {
    key: "history",
    href: "/history",
    icon: Wallet,
  },
  {
    key: "assistant",
    href: "/assistant",
    icon: Sparkles,
  },
  {
    key: "preferences",
    href: "/preferences",
    icon: LayoutGrid,
  },
  {
    key: "plan",
    href: "/plan",
    icon: Crown,
  },
  {
    key: "account",
    href: "/account",
    icon: Settings,
  },
] as const
