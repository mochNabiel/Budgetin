"use client"

import { useActionState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { verifyOtp } from "@/actions/auth"
import { useCountdown } from "@/hooks/use-countdown"
import { toast } from "sonner"

const OTP_LENGTH = 6

export default function VerifyOtpPage() {
  const email = useSearchParams().get("email") as string
  const router = useRouter()
  const { formattedTime, isExpired } = useCountdown(600)
  const [state, formAction, isPending] = useActionState(verifyOtp, {
    success: false,
    message: "",
  })

  const { message } = state

  useEffect(() => {
    if (!isExpired) return

    toast.error("Kode OTP kadaluarsa", {
      description: "Silakan login ulang untuk mendapatkan kode baru.",
    })

    router.push("/auth/login")
  }, [isExpired, router])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-2">
        <div className="mb-4 flex flex-col items-center justify-center text-center">
          <h1 className="mb-2 text-2xl font-bold">Cek emailmu</h1>
          <FieldDescription className="text-center">
            Kami mengirim kode 6 digit ke{" "}
            <span className="font-medium text-primary">{email}</span>
          </FieldDescription>
          <FieldDescription className="text-center">
            Masukkan kode di bawah untuk melanjutkan.
          </FieldDescription>
        </div>

        <form action={formAction}>
          <FieldGroup>
            <Field>
              <InputOTP
                maxLength={OTP_LENGTH}
                name="otp"
                disabled={isPending}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="lg:size-12" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <FieldError className="text-center">{message}</FieldError>
              <FieldDescription className="text-center">
                Kode OTP berlaku selama{" "}
                <span className="font-medium text-primary">
                  {formattedTime}
                </span>
              </FieldDescription>
              <Input type="hidden" name="email" value={email} />
            </Field>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Memverifikasi..." : "Verifikasi"}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}
