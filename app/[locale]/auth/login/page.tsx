import { Metadata } from "next"
import type { Locale } from "next-intl"

import { FieldSeparator } from "@/components/ui/field"
import { getTranslations } from "next-intl/server"

import AuthTopbar from "@/features/auth/components/auth-topbar"
import AuthContainer from "@/features/auth/components/auth-container"
import AuthHeading from "@/features/auth/components/auth-heading"

import EmailLoginForm from "@/features/auth/components/login/email-login-form"
import GoogleLoginForm from "@/features/auth/components/login/google-login-form"
import AuthFooter from "@/features/auth/components/auth-footer"
import BackHomeButton from "@/features/auth/components/login/back-home-button"

export const metadata: Metadata = {
  title: "Budgetin - Login",
  description: "Login",
}

interface Props {
  params: Promise<{ locale: Locale }>
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.login" })
  return (
    <AuthContainer>
      <AuthTopbar />
      <AuthHeading
        title={
          <>
            {t("title")} <span className="text-primary">Budgetin</span>
          </>
        }
        description={t("description")}
      />
      <EmailLoginForm />
      <FieldSeparator className="my-4">{t("or")}</FieldSeparator>
      <GoogleLoginForm />
      <BackHomeButton locale={locale} />
      <AuthFooter />
    </AuthContainer>
  )
}
