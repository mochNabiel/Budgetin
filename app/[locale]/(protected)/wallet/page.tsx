import PageHeader from "@/components/global/page-header"
import { Button } from "@/components/ui/button"
import WalletList from "@/features/wallet/components/wallet-list"
import { Link } from "@/i18n/navigation"
import { Plus } from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: "Budgetin - Wallet",
  description: "Wallet",
}

export default async function WalletPage() {
  const t = await getTranslations("wallet")
  return (
    <div>
      <PageHeader title={t("list.header_title")} backHref="/home" />

      <main className="flex flex-col gap-4 p-4">
        <Button className="h-12 w-full" asChild>
          <Link href={"/wallet/new"} className="flex items-center gap-2">
            <Plus />
            {t("add_wallet")}
          </Link>
        </Button>
        <WalletList />
      </main>
    </div>
  )
}
