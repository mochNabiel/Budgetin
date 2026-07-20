export default function formatDate(date: string, locale: string = "en") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(date))
}

export function formatDateTime(date: string, locale: string = "en") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}
