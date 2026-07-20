"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form"

interface NotesFieldProps<T extends FieldValues = FieldValues> {
  field: ControllerRenderProps<T>
  fieldState: ControllerFieldState
  formId: string
}

export default function NotesField<T extends FieldValues = FieldValues>({
  field,
  fieldState,
  formId,
}: NotesFieldProps<T>) {
    const t = useTranslations("transaction")
  return (
    <Field data-invalid={fieldState.invalid} className="gap-2">
      <FieldLabel htmlFor={`${formId}-notes`} className="font-normal">
        {t("notes")}
      </FieldLabel>
      <Textarea
        {...field}
        id={`${formId}-notes`}
        aria-invalid={fieldState.invalid}
        placeholder={t("notes_placeholder")}
        className="min-h-30"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
