import BottomNavBar from "@/components/global/bottom-nav"
import { getWallets } from "@/features/wallet/lib/queries"

interface Props {
  children: React.ReactNode
}

export default async function TabsLayout({ children }: Props) {
  const wallets = await getWallets()
  return (
    <>
      {children}
      <BottomNavBar walletCount={wallets.length} />
    </>
  )
}
