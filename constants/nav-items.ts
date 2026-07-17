import {
  Home,
  Sparkles,
  LayoutGrid,
  Settings,
  PieChart,
} from "lucide-react"

export const navItems = [
  {
    key: "home",
    href: "/home",
    icon: Home,
  },
  {
    key: "transaction",
    href: "/transaction",
    icon: LayoutGrid,
  },
  {
    key: "statistics",
    href: "/statistics",
    icon: PieChart,
  },
  {
    key: "assistant",
    href: "/assistant",
    icon: Sparkles,
  },
  {
    key: "settings",
    href: "/settings",
    icon: Settings,
  },
] as const
