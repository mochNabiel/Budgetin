import { ProfileSection } from "./_components/profile"
import { PlanSection } from "./_components/plan"
import { SecuritySection } from "./_components/security"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Budgetin - Akun",
  description: "Akun",
}

export default function AccountPage() {
  return (
    <div className="w-full space-y-4 p-2">
      <header className="flex flex-col items-center justify-center lg:items-start">
        <h1 className="text-lg font-semibold tracking-tight text-primary lg:text-xl">
          Pengaturan Akun
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola profil, langganan, dan keamanan akunmu.
        </p>
      </header>

      <main className="space-y-4">
        <ProfileSection />
        <PlanSection />
        <SecuritySection />
      </main>

      <footer>
        <p className="my-8 text-center text-xs text-muted-foreground/60">
          Budgetin v1.0.0 · Dibuat untuk pengelolaan keuangan yang lebih cerdas.
        </p>
      </footer>
    </div>
  )
}
