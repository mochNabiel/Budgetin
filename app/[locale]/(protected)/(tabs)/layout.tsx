import BottomNavBar from "@/components/global/bottom-nav"
import { getWallets } from "@/features/wallet/lib/queries"
import { Suspense } from "react"

interface Props {
  children: React.ReactNode
}

async function WalletNav() {
  const wallets = await getWallets()
  return <BottomNavBar walletCount={wallets.length} />
}

export default async function TabsLayout({ children }: Props) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <WalletNav />
      </Suspense>
    </>
  )
}
