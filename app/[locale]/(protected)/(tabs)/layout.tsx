import BottomNavBar from "@/components/global/bottom-nav"

interface Props {
  children: React.ReactNode
}

export default function TabsLayout({ children }: Props) {
  return (
    <>
      {children}
      <BottomNavBar />
    </>
  )
}
