"use client"

import { useActionState } from "react"
import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { verifyOtp } from "@/features/auth/lib/actions/verify-otp"
import { useCountdown } from "@/shared/hooks/use-countdown"
import { INITIAL_ACTION_STATE } from "@/types"

import { OtpInput } from "./otp-input"
import { useTranslations } from "next-intl"

export function VerifyOtpForm() {
  const router = useRouter()
  const { formattedTime, isExpired } = useCountdown(600)
  const [state, formAction, isPending] = useActionState(
    verifyOtp,
    INITIAL_ACTION_STATE
  )

  const t = useTranslations("auth.otp")

  const serverError =
    !state.success && state.message ? state.message : undefined

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isExpired) {
      e.preventDefault()
      toast.error(t("expired_toast_title"), {
        description: t("expired_toast_description"),
      })
      router.push("/auth/login")
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate>
      <FieldGroup className="gap-4">
        <OtpInput
          disabled={isPending}
          error={serverError}
          formattedTime={formattedTime}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? t("verifying") : t("confirm")}
        </Button>
      </FieldGroup>
    </form>
  )
}
