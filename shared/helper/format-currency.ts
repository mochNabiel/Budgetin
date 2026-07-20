const CURRENCY_LOCALE_MAP: Record<string, string> = {
  IDR: "id-ID",
  MYR: "ms-MY",
  USD: "en-US",
  EUR: "de-DE",
  JPY: "ja-JP",
}

function resolveLocale(currency: string) {
  return CURRENCY_LOCALE_MAP[currency] ?? "en-US"
}

export default function formatCurrency(amount: number, currency: string) {
  const locale = resolveLocale(currency)

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getCurrencySymbol(currency: string) {
  const locale = resolveLocale(currency)

  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(0)

  return parts.find((part) => part.type === "currency")?.value ?? currency
}
