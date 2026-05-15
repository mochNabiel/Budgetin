import { AppSidebar } from "@/app/(protected)/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

export default ProtectedLayout
