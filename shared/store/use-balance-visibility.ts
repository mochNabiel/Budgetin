"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface BalanceVisibilityState {
  hidden: boolean
  hydrated: boolean
  toggle: () => void
}

export const useBalanceVisibility = create<BalanceVisibilityState>()(
  persist(
    (set) => ({
      hidden: false,
      hydrated: false,

      toggle: () =>
        set((state) => ({
          hidden: !state.hidden,
        })),
    }),
    {
      name: "balance-visibility",
      onRehydrateStorage: () => () => {
        useBalanceVisibility.setState({
          hydrated: true,
        })
      },
    }
  )
)
