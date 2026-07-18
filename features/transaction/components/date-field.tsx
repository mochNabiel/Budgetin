"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import {
  getToday,
  isSameDay,
  getYesterday,
  formatDisplayDate,
} from "@/shared/helper/date"
import { cn } from "@/shared/utils"
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form"
import { Button } from "@/components/ui/button"

interface DateFieldProps<T extends FieldValues = FieldValues> {
  field: ControllerRenderProps<T>
  fieldState: ControllerFieldState
  type: "income" | "expense"
}

export default function DateField<T extends FieldValues = FieldValues>({
  field,
  fieldState,
  type,
}: DateFieldProps<T>) {
  const [open, setOpen] = useState(false)
  const isIncome = type === "income"

  const selectedDate: Date = field.value ?? getToday()

  const isToday = isSameDay(selectedDate, getToday())
  const isYesterday = isSameDay(selectedDate, getYesterday())

  const displayLabel = isToday
    ? `Today, ${formatDisplayDate(selectedDate)}`
    : isYesterday
      ? `Yesterday, ${formatDisplayDate(selectedDate)}`
      : formatDisplayDate(selectedDate)

  const toggleLabel = isYesterday ? "Today?" : "Yesterday?"

  const handleToggle = () => {
    field.onChange(isYesterday ? getToday() : getYesterday())
  }

  return (
    <Field data-invalid={fieldState.invalid} className="gap-2">
      <div className="flex items-center justify-between">
        <FieldLabel
          htmlFor="add-trx-form-date"
          className="text-base font-normal"
        >
          Date
        </FieldLabel>
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            isIncome
              ? "bg-chart-2/10 text-chart-2"
              : "bg-primary/10 text-primary"
          )}
        >
          {toggleLabel}
        </button>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="add-trx-form-date"
            variant="outline"
            className="flex w-full items-center justify-between rounded-xl bg-input/30 px-3 py-6 text-left text-sm font-normal"
          >
            <span>{displayLabel}</span>
            <CalendarIcon className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                field.onChange(date)
                setOpen(false)
              }
            }}
            disabled={{ after: getToday() }}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
