import { getFormatter } from "next-intl/server"

export async function getCurrentDate() {
  const format = await getFormatter()

  const currentDate = format.dateTime(new Date(), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return currentDate
}
