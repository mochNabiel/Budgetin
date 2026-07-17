import { UserProvider } from "@/components/global/user-provider"
import { getUserData } from "@/features/auth/lib/queries/get-user-data"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserData()

  return (
    <UserProvider user={user}>
      <div className="mx-auto max-w-lg">
        {children}
      </div>
    </UserProvider>
  )
}
