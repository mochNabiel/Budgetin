"use client"

import { useState } from "react"
import { StepProfile } from "./step-profile"
import { StepWallet } from "./step-wallet"
import { cn } from "@/shared/utils"

interface OnboardingShellProps {
  defaultName?: string
  defaultAvatar?: string
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === current ? "w-6 bg-primary" : "w-1.5 bg-muted"
          )}
        />
      ))}
    </div>
  )
}

export function OnboardingShell({
  defaultName,
  defaultAvatar,
}: OnboardingShellProps) {
  const [step, setStep] = useState<0 | 1>(0)

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator current={step} total={2} />

      {step === 0 && (
        <StepProfile
          defaultName={defaultName}
          defaultAvatar={defaultAvatar}
          onDone={() => setStep(1)}
        />
      )}

      {step === 1 && <StepWallet />}
    </div>
  )
}
