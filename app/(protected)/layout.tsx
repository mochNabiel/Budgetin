import { AppSidebar } from "@/app/(protected)/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { UserProvider } from "@/components/user-provider"
import { getUserData } from "@/lib/queries/get-user-data"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserData()

  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </UserProvider>
  )
}