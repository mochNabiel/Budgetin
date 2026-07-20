"use client"

import { IUser } from "@/features/auth/lib/queries/get-user-data"
import { createContext, useContext } from "react"

const UserContext = createContext<IUser | null>(null)

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
  user: IUser | null
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
