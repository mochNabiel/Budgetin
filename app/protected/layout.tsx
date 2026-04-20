import BottomNav from "@/components/bottom-nav"

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh">
      <main>{children}</main>
      <BottomNav />
    </div>
  )
}

export default ProtectedLayout
