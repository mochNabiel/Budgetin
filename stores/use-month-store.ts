import { create } from "zustand"

type MonthStore = {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

export const useMonthStore =
  create<MonthStore>((set) => ({
    selectedDate: new Date(),

    setSelectedDate: (date) =>
      set({
        selectedDate: date,
      }),
  }))