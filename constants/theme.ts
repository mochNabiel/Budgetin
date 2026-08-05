import { Monitor, MoonStar, SunMedium } from "lucide-react"

export type ThemeOption = "system" | "light" | "dark"

export const THEME_OPTIONS: { value: ThemeOption; icon: typeof Monitor }[] = [
  { value: "system", icon: Monitor },
  { value: "light", icon: SunMedium },
  { value: "dark", icon: MoonStar },
]
