import { notFound } from "next/navigation"
import { getTransactionDetail } from "@/features/transaction/lib/queries/get-transaction-detail"
import { getWallets } from "@/features/wallet/lib/queries"
import { getCategories } from "@/features/category/lib/queries/get-categories"
import EditTransactionForm from "@/features/transaction/components/edit/edit-transaction-form"
import PageHeader from "@/components/global/page-header"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Locale } from "next-intl"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>
}

export const metadata: Metadata = {
  title: "Budgetin - Edit Transaction",
  description: "Edit Transaction",
}

export default async function EditTransactionPage({ params }: PageProps) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const t = await getTranslations("transaction")

  let transaction
  try {
    transaction = await getTransactionDetail(id)
  } catch {
    notFound()
  }

  const categories = await getCategories()
  const wallets = await getWallets()

  const filteredCategories = categories.filter(
    (category) => category.type === transaction.type
  )

  return (
    <div>
      <PageHeader
        title={t("edit.header_title")}
        backHref={`/transaction/${id}`}
      />

      <main className="p-2">
        <EditTransactionForm
          transaction={transaction}
          wallets={wallets}
          categories={filteredCategories}
        />
      </main>
    </div>
  )
}
