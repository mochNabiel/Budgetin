import { getTransactions } from "@/features/transaction/lib/queries/get-transactions"
import { getWallets } from "@/features/wallet/lib/queries"
import { getCategories } from "@/features/category/lib/queries/get-categories"
import TransactionFilterDialog from "@/features/transaction/components/history/transaction-filter-dialog"
import TransactionList from "@/features/transaction/components/history/transaction-list"
import PageHeader from "@/components/global/page-header"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

interface PageProps {
  searchParams: Promise<{
    from?: string
    to?: string
    type?: "income" | "expense"
    wallet?: string
    category?: string
  }>
}

export const metadata: Metadata = {
  title: "Budgetin - Transaction History",
  description: "Transaction History",
}

export default async function TransactionPage({ searchParams }: PageProps) {
  const t = await getTranslations("transaction")

  const sp = await searchParams

  const [transactions, wallets, categories] = await Promise.all([
    getTransactions({
      from: sp.from,
      to: sp.to,
      type: sp.type,
      walletId: sp.wallet,
      categoryId: sp.category ? Number(sp.category) : undefined,
    }),
    getWallets(),
    getCategories(),
  ])

  return (
    <div>
      <PageHeader
        title={t("history.header_title")}
        backHref="/home"
        right={
          <TransactionFilterDialog
            wallets={wallets}
            categories={categories}
            currentFilters={sp}
          />
        }
      />

      <main className="p-2">
        <TransactionList transactions={transactions} />
      </main>
    </div>
  )
}
