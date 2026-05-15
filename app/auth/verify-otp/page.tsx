import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { VerifyOtpForm } from "./verify-otp-form"

function VerifyOtpFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpFallback />}>
      <VerifyOtpForm />
    </Suspense>
  )
}
