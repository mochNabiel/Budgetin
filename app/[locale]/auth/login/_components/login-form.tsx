"use client"

import Image from "next/image"
import Link from "next/link"
import { useActionState } from "react"
import { signInWithOtp, signInWithGoogle } from "@/lib/actions/auth"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { INITIAL_ACTION_STATE } from "@/types"
import { FcGoogle } from "react-icons/fc"

export function LoginForm() {
  const [otpState, otpAction, isOtpPending] = useActionState(
    signInWithOtp,
    INITIAL_ACTION_STATE
  )

  const [googleState, googleAction, isGooglePending] = useActionState(
    signInWithGoogle,
    INITIAL_ACTION_STATE
  )

  const { message: otpMessage } = otpState
  const { message: googleMessage } = googleState

  return (
    <div className="flex flex-col gap-6">
      <form action={otpAction}>
        <FieldGroup>
          <div className="flex flex-col items-center text-center">
            <Image
              src="/icons/logo.svg"
              alt="logo"
              width={24}
              height={24}
              className="mb-2"
            />
            <h1 className="text-xl font-bold">
              Yuk mulai bareng <span className="text-primary">Budgetin</span>
            </h1>
            <FieldDescription>
              Bantu dirimu lebih bijak soal uang mulai sekarang
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={isOtpPending}>
              {isOtpPending ? "Memuat..." : "Lanjutkan"}
            </Button>
            <FieldError className="text-center">{otpMessage}</FieldError>
          </Field>
        </FieldGroup>
      </form>

      <FieldSeparator>atau</FieldSeparator>

      <form action={googleAction}>
        <Field>
          <Button variant="outline" type="submit" disabled={isGooglePending}>
            <FcGoogle />
            {isGooglePending ? "Memuat..." : "Masuk dengan Google"}
          </Button>
          <FieldError className="text-center">{googleMessage}</FieldError>
        </Field>
      </form>

      <FieldDescription className="px-6 text-center">
        Dengan melanjutkan, kamu menyetujui{" "}
        <Link href="#">Syarat & Ketentuan</Link> dan{" "}
        <Link href="#">Kebijakan Privasi</Link>.
      </FieldDescription>
    </div>
  )
}
