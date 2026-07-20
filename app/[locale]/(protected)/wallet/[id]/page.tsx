import { notFound } from "next/navigation"
import PageHeader from "@/components/global/page-header"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { Pencil } from "lucide-react"
import { getWalletDetail } from "@/features/wallet/lib/queries/get-wallet-detail"
import { getTransactions } from "@/features/transaction/lib/queries/get-transactions"
import { getUserData } from "@/features/auth/lib/queries"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { getLocale, getTranslations } from "next-intl/server"
import TransactionList from "@/features/transaction/components/history/transaction-list"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Budgetin - Wallet Detail",
  description: "Wallet Detail",
}

export default async function WalletDetailPage({ params }: PageProps) {
  const { id } = await params
  const t = await getTranslations("wallet.detail")

  let wallet
  try {
    wallet = await getWalletDetail(id)
  } catch {
    notFound()
  }

  const { currency } = await getUserData()
  const locale = await getLocale()
  const transactions = await getTransactions({ walletId: id })

  return (
    <div>
      <PageHeader
        title={t("header_title")}
        backHref="/home"
        right={
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/wallet/${wallet.id}/edit`}>
              <Pencil className="size-5" />
            </Link>
          </Button>
        }
      />

      <main className="flex flex-col gap-4 p-4">
        {/* Wallet hero */}
        <section
          className="flex flex-col items-center gap-3 rounded-2xl border py-8"
          style={{
            borderColor: wallet.color,
            backgroundColor: `${wallet.color}15`,
          }}
        >
          <span
            className="flex size-16 items-center justify-center rounded-full text-3xl"
            style={{ backgroundColor: wallet.color }}
          >
            {wallet.icon}
          </span>

          <p className="text-sm text-muted-foreground">{wallet.name}</p>

          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(wallet.balance, currency)}
          </p>

          <div className="flex flex-col items-center">
            <p className="text-xs text-muted-foreground">
              {t("created")} {formatDate(wallet.created_at, locale)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("updated")} {formatDate(wallet.updated_at, locale)}
            </p>
          </div>
        </section>

        {/* Transactions in this wallet */}
        <section className="flex flex-col gap-2">
          <p className="px-1 text-sm font-medium text-muted-foreground">
            {t("transactions")}
          </p>
          <TransactionList transactions={transactions} />
        </section>
      </main>
    </div>
  )
}
