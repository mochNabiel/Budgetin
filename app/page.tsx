import LoginButton from "@/components/login-button"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/logout-button"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Budgetin - Smart Money Tracking",
  description: "Track your income and expenses effortlessly with Budgetin.",
}

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Headline */}
        <div className="space-y-3">
          <span className="align-middle relative inline-block h-8 w-8">
            <Image
              src="../assets/icons/logo.svg"
              alt="budgetin logo"
              fill
              className="object-contain"
            />
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-card-foreground">
            Budgetin is cooking 🍳
          </h1>
          <p className="text-sm text-muted-foreground">
            We’re crafting a smarter way to track your money. Clean, simple, and
            actually useful.
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-1.5 text-xs backdrop-blur">
          🚧 Work in progress
        </div>

        {/* CTA */}
        <div className="pt-2">
          {data?.claims.email ? (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                You’re logged in. Stay tuned 👀
              </p>
              <LogoutButton />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Be the first to try it.
              </p>
              <LoginButton />
            </div>
          )}
        </div>

        {/* Footer vibe */}
        <p className="pt-6 text-[11px] text-muted-foreground">
          Built for students who want to stop wondering where their money went.
        </p>
      </div>
    </div>
  )
}
