// app/[locale]/wallet/[id]/edit/page.tsx — opsional disederhanakan
import { notFound } from "next/navigation"
import PageHeader from "@/components/global/page-header"
import { getWalletDetail } from "@/features/wallet/lib/queries/get-wallet-detail"
import EditWalletClient from "@/features/wallet/components/edit-wallet-client"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Budgetin - Edit Wallet",
  description: "Edit Wallet",
}

export default async function EditWalletPage({ params }: PageProps) {
  const { id } = await params
  const t = await getTranslations("wallet.edit")

  let wallet
  try {
    wallet = await getWalletDetail(id)
  } catch {
    notFound()
  }

  return (
    <div>
      <PageHeader title={t("header_title")} backHref={`/wallet/${id}`} />

      <main className="p-4">
        <EditWalletClient wallet={wallet} />
      </main>
    </div>
  )
}
