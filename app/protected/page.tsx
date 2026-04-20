import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import Navbar from "@/components/sections/navbar"
import CurrentBalance from "@/components/sections/current-balance"
import Expense from "@/components/sections/expense"
import { Metadata } from "next"

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
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col gap-4 bg-primary">
      <Navbar />
      <CurrentBalance />
      <Expense />
    </div>
  )
}
