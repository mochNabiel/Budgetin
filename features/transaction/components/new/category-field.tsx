"use client"

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ICategory } from "@/features/category/lib/queries/get-categories"
import { useTranslations } from "next-intl"
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form"

interface CategoryFieldProps<T extends FieldValues = FieldValues> {
  field: ControllerRenderProps<T>
  fieldState: ControllerFieldState
  categories: ICategory[]
  formId: string
}

export default function CategoryField<T extends FieldValues = FieldValues>({
  field,
  fieldState,
  categories,
  formId,
}: CategoryFieldProps<T>) {
  const t = useTranslations("transaction")

  return (
    <Field data-invalid={fieldState.invalid} className="gap-2">
      <FieldContent>
        <FieldLabel htmlFor={`${formId}-category`} className="font-normal">
          {t("category")}
        </FieldLabel>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </FieldContent>
      <Select
        name={field.name}
        value={field.value ? String(field.value) : undefined}
        onValueChange={(value) => field.onChange(Number(value))}
      >
        <SelectTrigger
          id={`${formId}-category`}
          aria-invalid={fieldState.invalid}
          className="w-full rounded-xl py-6"
        >
          <SelectValue placeholder={t("category_placeholder")} />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={String(category.id)}
              className="capitalize"
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex size-8 items-center justify-center rounded-full text-lg"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </span>
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
