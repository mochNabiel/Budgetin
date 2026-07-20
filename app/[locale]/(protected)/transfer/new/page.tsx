import { notFound } from "next/navigation"
import PageHeader from "@/components/global/page-header"
import { getWallets } from "@/features/wallet/lib/queries"
import AddTransferForm from "@/features/transfer/components/add-transfer-form"
import { getTranslations } from "next-intl/server"

export default async function NewTransferPage() {
  const wallets = await getWallets()
  const t = await getTranslations("transfer.new")

  // Guard server-side juga — bukan cuma disable di UI Sheet,
  // supaya user tidak bisa akses langsung via URL kalau wallet cuma 1
  if (wallets.length < 2) {
    notFound()
  }

  return (
    <div>
      <PageHeader title={t("header_title")} backHref="/home" />
      <main className="p-2">
        <AddTransferForm wallets={wallets} />
      </main>
    </div>
  )
}
