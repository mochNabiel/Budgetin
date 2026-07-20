import {
  Home,
  Sparkles,
  BarChartBig,
  User2,
} from "lucide-react"

export const navItems = [
  {
    key: "home",
    href: "/home",
    icon: Home,
  },
  {
    key: "statistics",
    href: "/statistics",
    icon: BarChartBig,
  },
  {
    key: "assistant",
    href: "/assistant",
    icon: Sparkles,
  },
  {
    key: "settings",
    href: "/settings",
    icon: User2,
  },
] as const
