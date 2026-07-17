"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useTranslations } from "next-intl"
import { useActionState } from "react"
import { signInWithOtp } from "@/features/auth/lib/actions/sign-in-with-otp"
import { INITIAL_ACTION_STATE } from "@/types"

export default function EmailLoginForm() {
  const [otpState, otpAction, isOtpPending] = useActionState(
    signInWithOtp,
    INITIAL_ACTION_STATE
  )

  const { message: otpMessage } = otpState

  const t = useTranslations("auth.login")

  return (
    <form action={otpAction}>
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isOtpPending}>
            {isOtpPending ? t("processing") : t("continue")}
          </Button>
          <FieldError className="text-center">{otpMessage}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  )
}
