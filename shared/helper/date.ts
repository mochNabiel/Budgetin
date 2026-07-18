export function getToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function getYesterday() {
  const d = getToday()
  d.setDate(d.getDate() - 1)
  return d
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function formatDisplayDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}