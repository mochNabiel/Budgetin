"use client"

import { User } from "@supabase/supabase-js"
import { createContext, useContext } from "react"

const UserContext = createContext<User | null>(null)

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }

  return context
}

export function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode
  user: User | null
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
