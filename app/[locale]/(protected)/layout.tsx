import { UserProvider } from "@/components/global/user-provider"
import { getUserData } from "@/features/auth/lib/queries"

interface Props {
  children: React.ReactNode
}

export default async function ProtectedLayout({ children }: Props) {
  const user = await getUserData()
  return (
    <UserProvider user={user}>
      <div className="mx-auto max-w-lg">{children}</div>
    </UserProvider>
  )
}
