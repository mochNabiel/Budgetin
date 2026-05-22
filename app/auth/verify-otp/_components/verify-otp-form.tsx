"use client"

import Image from "next/image"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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

import { verifyOtp } from "@/lib/actions/auth"
import { useCountdown } from "@/hooks/use-countdown"
import { INITIAL_ACTION_STATE } from "@/types"

const OTP_LENGTH = 6

export function VerifyOtpForm() {
  const router = useRouter()
  const { formattedTime, isExpired } = useCountdown(600)
  const [state, formAction, isPending] = useActionState(
    verifyOtp,
    INITIAL_ACTION_STATE
  )

  useEffect(() => {
    if (!isExpired) return

    toast.error("Kode OTP kadaluarsa", {
      description: "Silakan login ulang untuk mendapatkan kode baru.",
    })

    router.push("/auth/login")
  }, [isExpired, router])

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction}>
        <FieldGroup>
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <Image
              src="/assets/icons/logo.svg"
              alt="logo"
              width={24}
              height={24}
              className="mb-2"
            />
            <h1 className="text-xl font-bold">
              Cek <span className="text-primary">emailmu</span>
            </h1>
            <FieldDescription className="text-center">
              Kami mengirim kode 6 digit ke emailmu. Masukkan kode di bawah
              untuk melanjutkan.
            </FieldDescription>
          </div>

          {/* OTP Input */}
          <Field>
            <InputOTP
              maxLength={OTP_LENGTH}
              name="otp"
              disabled={isPending}
              containerClassName="w-full"
            >
              <InputOTPGroup className="w-full gap-2">
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-12 flex-1 rounded-xl border border-input bg-background text-base transition-all first:rounded-xl last:rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {state.message && (
              <FieldError className="text-center">{state.message}</FieldError>
            )}

            <FieldDescription className="text-center">
              Kode berlaku selama{" "}
              <span className="font-medium text-primary">{formattedTime}</span>
            </FieldDescription>
          </Field>

          {/* Submit */}
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Memverifikasi..." : "Verifikasi"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {/* Back link */}
      <FieldDescription className="text-center">
        Belum menerima kode?{" "}
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Kirim ulang
        </button>
      </FieldDescription>
    </div>
  )
}
