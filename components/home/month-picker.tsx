"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDown, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
]

const today = new Date()

export function MonthPicker() {
  const [open, setOpen] = React.useState(false)

  const [selectedDate, setSelectedDate] = React.useState(today)

  const [displayYear, setDisplayYear] = React.useState(today.getFullYear())

  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  const isCurrentMonth =
    currentMonth === today.getMonth() && currentYear === today.getFullYear()

  const isNextYearDisabled = displayYear >= today.getFullYear()

  function handleSelectMonth(monthIndex: number) {
    // prevent selecting future month
    const isFutureMonth =
      displayYear === today.getFullYear() && monthIndex > today.getMonth()

    if (isFutureMonth) return

    const newDate = new Date(displayYear, monthIndex, 1)

    setSelectedDate(newDate)
    setOpen(false)
  }

  function handleResetToday() {
    setSelectedDate(today)
    setDisplayYear(today.getFullYear())
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {format(selectedDate, "MMMM yyyy")}
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDisplayYear((prev) => prev - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold">{displayYear}</span>

            {!isCurrentMonth && (
              <button
                onClick={handleResetToday}
                className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <RotateCcw className="size-3" />
                Kembali ke bulan ini
              </button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={isNextYearDisabled}
            onClick={() => setDisplayYear((prev) => prev + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* QUICK ACTION */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => {
              const prevMonth = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth() - 1,
                1
              )

              setSelectedDate(prevMonth)
              setDisplayYear(prevMonth.getFullYear())
              setOpen(false)
            }}
          >
            Bulan lalu
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            disabled={isCurrentMonth}
            onClick={handleResetToday}
          >
            Bulan ini
          </Button>
        </div>

        {/* MONTH GRID */}
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => {
            const isSelected =
              currentMonth === index && currentYear === displayYear

            const isFutureMonth =
              displayYear === today.getFullYear() && index > today.getMonth()

            return (
              <Button
                key={month}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                disabled={isFutureMonth}
                onClick={() => handleSelectMonth(index)}
              >
                {month}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
