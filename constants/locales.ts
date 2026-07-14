export const locales = [
  {
    value: "en",
    label: "English",
    flag: "🇺🇸",
  },
  {
    value: "id",
    label: "Indonesia",
    flag: "🇮🇩",
  },
] as const

export type AppLocale = (typeof locales)[number]["value"]
