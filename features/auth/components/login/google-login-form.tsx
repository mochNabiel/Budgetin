"use client"

import { useActionState } from "react"
import { FcGoogle } from "react-icons/fc"

import { signInWithGoogle } from "@/features/auth/lib/actions/sign-in-with-google"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { INITIAL_ACTION_STATE } from "@/types"
import { useTranslations } from "next-intl"

export default function GoogleLoginForm() {
  const [state, action, isPending] = useActionState(
    signInWithGoogle,
    INITIAL_ACTION_STATE
  )

  const t = useTranslations("auth")

  return (
    <form action={action}>
      <Button
        variant="outline"
        type="submit"
        disabled={isPending}
        className="w-full"
      >
        <FcGoogle className="mr-2 size-4" aria-hidden />
        {isPending ? t("processing") : t("login.google")}
      </Button>
      {state.message && !state.success && (
        <FieldError className="mt-2 text-center">{state.message}</FieldError>
      )}
    </form>
  )
}
