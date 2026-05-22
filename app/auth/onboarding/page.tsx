import { Metadata } from "next"
import { OnboardingForm } from "./_components/onboarding-form"

export const metadata: Metadata = {
  title: "Budgetin - Onboarding",
  description: "Complete your onboarding",
}

export default function OnboardingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 lg:p-10">
      <div className="w-full max-w-sm">
        <OnboardingForm />
      </div>
    </div>
  )
}
