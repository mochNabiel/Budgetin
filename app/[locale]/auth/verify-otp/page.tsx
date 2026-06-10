import { VerifyOtpForm } from "./_components/verify-otp-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Budgetin - Verify OTP",
  description: "Verify OTP",
}

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 lg:p-10">
      <div className="w-full max-w-sm">
        <VerifyOtpForm />
      </div>
    </div>
  )
}
