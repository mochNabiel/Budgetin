import LoginButton from "@/components/login-button"
import { Metadata } from "next"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/logout-button"

export const metadata: Metadata = {
  title: "Budgetin - Kelola Keuanganmu",
  description:
    "Budgetin adalah aplikasi untuk membantu kamu mengelola keuanganmu dengan mudah dan teratur.",
}

export default async function Page() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-8 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>

          {data?.claims.email ? <LogoutButton /> : <LoginButton />}
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
