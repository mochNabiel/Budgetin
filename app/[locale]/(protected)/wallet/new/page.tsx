import PageHeader from "@/components/global/page-header"
import WalletForm from "@/features/wallet/components/wallet-form"
import { createWallet } from "@/features/wallet/lib/actions/create-wallet"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: "Budgetin - Create Wallet",
  description: "Create Wallet",
}

export default async function NewWalletPage() {
  const t = await getTranslations("wallet.new")

  return (
    <div>
      <PageHeader title={t("header_title")} backHref="/home" />

      <main className="p-4">
        <WalletForm
          mode="create"
          onSubmitAction={createWallet}
        />
      </main>
    </div>
  )
}
