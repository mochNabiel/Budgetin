"use server"

import { getBalanceSummary } from "../queries/get-balance-summary"
import type { IBalanceSummary } from "@/types/balance-summary"

export async function getBalanceSummaryForPeriod(
  period: "month" | "all"
): Promise<IBalanceSummary> {
  return getBalanceSummary(
    period === "all"
      ? { allTime: true }
      : {
          from: new Date().toISOString().slice(0, 8) + "01",
          to: new Date().toISOString().slice(0, 10),
        }
  )
}
