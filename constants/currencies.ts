export interface ICurrency {
  code: string
  name: string
}

export const CURRENCIES: ICurrency[] = [
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "JPY", name: "Japanese Yen" },
] as const

// Buat Enum, biar penambahan Currency tidak perlu manual set enum di schema lagi
export const currencyCodes = CURRENCIES.map((currency) => currency.code) as [
  string,
  ...string[],
]
