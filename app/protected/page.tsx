import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import Header from "@/components/sections/header"
import CurrentBalance from "@/components/sections/current-balance"
import IncomeExpense from "@/components/sections/income-expense"
import { Metadata } from "next"
import TransactionHistory from "@/components/sections/transaction-history"

export const metadata: Metadata = {
  title: "Budgetin - Home",
  description: "Home",
}

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect("/auth/login")
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col gap-4 bg-card mb-36">
      <div className="rounded-b-4xl bg-card-foreground p-4">
        <Header />
        <CurrentBalance />
      </div>
      <IncomeExpense />
      <TransactionHistory />
    </div>
  )
}
