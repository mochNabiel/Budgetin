import { Metadata } from "next"
import AuthContainer from "@/features/auth/components/auth-container"
import AuthTopbar from "@/features/auth/components/auth-topbar"
import { OnboardingShell } from "@/features/auth/components/onboarding/onboarding-shell"
import { getUserData } from "@/features/auth/lib/queries/get-user-data"
import AuthFooter from "@/features/auth/components/auth-footer"

export const metadata: Metadata = {
  title: "Budgetin - Onboarding",
  description: "Complete your onboarding",
}

export default async function OnboardingPage() {
  const user = await getUserData()

  return (
    <AuthContainer>
      <AuthTopbar />
      <OnboardingShell
        defaultName={user.full_name}
        defaultAvatar={user.avatar_url}
      />
      <AuthFooter />
    </AuthContainer>
  )
}
