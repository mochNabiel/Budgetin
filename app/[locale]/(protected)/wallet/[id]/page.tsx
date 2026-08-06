import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale } from "next-intl/server"

import PageHeader from "@/components/global/page-header"
import { getUserData } from "@/features/auth/lib/queries"
import WalletDetail from "@/features/wallet/components/detail/wallet-detail"
import { getWalletActivity } from "@/features/wallet/lib/queries/get-wallet-activity"
import { getWalletDetail } from "@/features/wallet/lib/queries/get-wallet-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Budgetin - Wallet Detail",
  description: "Wallet Detail",
}

export default async function WalletDetailPage({ params }: PageProps) {
  const { id } = await params

  const [wallet, activity, user, locale] = await Promise.all([
    getWalletDetail(id).catch(() => null),
    getWalletActivity(id).catch(() => null),
    getUserData(),
    getLocale(),
  ])

  if (!wallet || !activity) {
    notFound()
  }

  return (
    <div>
      <PageHeader title={wallet.name} backHref="/home" />
      <WalletDetail
        wallet={wallet}
        activity={activity}
        currency={user.currency}
        locale={locale}
      />
    </div>
  )
}
