interface ICurrency {
  code: string
  name: string
  symbol: string
  locale: string
}

export const CURRENCIES: ICurrency[] = [
  {
    code: "IDR",
    name: "Indonesian Rupiah",
    symbol: "Rp",
    locale: "id-ID",
  },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
    symbol: "RM",
    locale: "ms-MY",
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    locale: "en-US",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    locale: "de-DE",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    locale: "ja-JP",
  },
] as const

// Buat Enum, biar penambahan Currency tidak perlu manual set enum di schema lagi
export const currencyCodes = CURRENCIES.map(
  (currency) => currency.code
) as [string, ...string[]]