import PageHeader from "@/components/global/page-header"
import AddWalletDialog from "@/features/wallet/components/add-wallet-dialog"
import WalletList from "@/features/wallet/components/wallet-list"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: "Budgetin - Wallet",
  description: "Wallet",
}

export default async function WalletPage() {
  const t = await getTranslations("wallet.list")
  return (
    <div>
      <PageHeader title={t("header_title")} backHref="/home" />

      <main className="flex flex-col gap-4 p-4">
        <AddWalletDialog />
        <WalletList />
      </main>
    </div>
  )
}
