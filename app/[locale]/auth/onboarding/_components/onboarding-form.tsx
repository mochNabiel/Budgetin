"use client"

import Image from "next/image"
import { useActionState, useState } from "react"

import { completeOnboarding } from "@/lib/actions/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { INITIAL_ACTION_STATE } from "@/types"

export function OnboardingForm() {
  const [preview, setPreview] = useState<string | null>(null)

  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    INITIAL_ACTION_STATE
  )

  function handlePreview(file: File | null) {
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setPreview(imageUrl)
  }

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
              Lengkapi <span className="text-primary">Profilmu</span>
            </h1>
            <FieldDescription className="text-center">
              Tambahkan nama dan foto profil agar akunmu lebih personal.
            </FieldDescription>
          </div>

          {/* Avatar */}
          <Field>
            <div className="flex flex-col items-center gap-3">
              {/* Preview */}
              <div className="relative size-20 overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition-colors hover:border-primary">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-7 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* File input styled as a subtle link */}
              <label className="cursor-pointer text-sm font-medium text-primary underline-offset-4 hover:underline">
                {preview ? "Ganti foto" : "Unggah foto profil"}
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handlePreview(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </Field>

          {/* Full name */}
          <Field>
            <FieldLabel htmlFor="full_name">Nama lengkap</FieldLabel>
            <Input
              id="full_name"
              name="full_name"
              placeholder="John Doe"
              required
            />
          </Field>

          {/* Error */}
          {state.message && (
            <FieldError className="text-center">{state.message}</FieldError>
          )}

          {/* Submit */}
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Lanjutkan ke Budgetin"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
