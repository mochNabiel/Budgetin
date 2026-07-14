import { Metadata } from "next"
import AuthContainer from "@/features/auth/components/auth-container"
import AuthTopbar from "@/features/auth/components/auth-topbar"
import AuthHeading from "@/features/auth/components/auth-heading"
import { VerifyOtpForm } from "@/features/auth/components/otp/verify-otp-form"
import { getTranslations } from "next-intl/server"
import type { Locale } from "next-intl"

export const metadata: Metadata = {
  title: "Budgetin - Verify OTP",
  description: "Verify OTP",
}

interface Props {
  params: Promise<{ locale: Locale }>
}

export default async function VerifyOtpPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.otp" })
  return (
    <AuthContainer>
      <AuthTopbar />
      <AuthHeading title={t("title")} description={t("description")} />
      <VerifyOtpForm />
    </AuthContainer>
  )
}
