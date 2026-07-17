import { cn } from "@/shared/utils"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useTranslations } from "next-intl"

const OTP_LENGTH = 6

const otpSlotClassName = cn(
  "size-12 rounded-xl border border-input bg-background text-base",
  "transition-all",
  "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary first:rounded-l-xl last:rounded-r-xl"
)

interface OtpInputProps {
  disabled?: boolean
  error?: string
  formattedTime: string
}

export function OtpInput({ disabled, error, formattedTime }: OtpInputProps) {
  const t = useTranslations("auth.otp")
  return (
    <div className="flex flex-col gap-2">
      <InputOTP
        maxLength={OTP_LENGTH}
        name="otp"
        disabled={disabled}
        containerClassName="w-full"
      >
        <InputOTPGroup className="justify-center gap-2 mx-auto">
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <InputOTPSlot key={i} index={i} className={otpSlotClassName} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      {error && <p className="text-center text-sm text-destructive">{error}</p>}

      <p className="text-center text-sm text-muted-foreground">
        {t("expires_in")}{" "}
        <span className="font-medium text-primary">{formattedTime}</span>
      </p>
    </div>
  )
}
