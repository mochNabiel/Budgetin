"use client"

import { useCallback, useState } from "react"
import { Activity } from "react"
import { StepProfile } from "./step-profile"
import { StepWallet } from "./step-wallet"
import { cn } from "@/shared/utils"

interface OnboardingShellProps {
  defaultName?: string
  defaultAvatar?: string
}

type OnboardingStep = 0 | 1

const TOTAL_STEPS = 2

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
  const [step, setStep] = useState<OnboardingStep>(0)
  const [currencyCode, setCurrencyCode] = useState<string>("USD")

  const handleProfileDone = useCallback((selectedCurrencyCode: string) => {
    setCurrencyCode(selectedCurrencyCode)
    setStep(1)
  }, [])

  const handleBackToProfile = useCallback(() => {
    setStep(0)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator current={step} total={TOTAL_STEPS} />

      <Activity mode={step === 0 ? "visible" : "hidden"}>
        <StepProfile
          defaultName={defaultName}
          defaultAvatar={defaultAvatar}
          onDone={handleProfileDone}
        />
      </Activity>

      <Activity mode={step === 1 ? "visible" : "hidden"}>
        <StepWallet currencyCode={currencyCode} onBack={handleBackToProfile} />
      </Activity>
    </div>
  )
}