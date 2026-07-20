import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddTransactionForm from "@/features/transaction/components/new/add-transaction-form"
import { getCategories } from "@/features/category/lib/queries/get-categories"
import { getWallets } from "@/features/wallet/lib/queries"
import { getTranslations } from "next-intl/server"
import PageHeader from "@/components/global/page-header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Budgetin - Create Transaction",
  description: "Create Transaction",
}

export default async function page() {
  const [wallets, categories] = await Promise.all([
    getWallets(),
    getCategories(),
  ])

  const t = await getTranslations("transaction")

  const incomeCategories = categories.filter(
    (category) => category.type === "income"
  )

  const expenseCategories = categories.filter(
    (category) => category.type === "expense"
  )

  return (
    <div>
      <PageHeader title={t("new.header_title")} />

      <main className="p-2">
        <Tabs defaultValue="expense" className="w-full rounded-xl">
          <TabsList className="mb-2 w-full rounded-xl border border-input py-6">
            <TabsTrigger
              value="expense"
              className="py-5 data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground dark:data-active:bg-primary"
            >
              {t("expense")}
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="py-5 data-active:bg-chart-2 data-active:text-primary-foreground hover:data-active:text-primary-foreground dark:data-active:bg-chart-2"
            >
              {t("income")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <AddTransactionForm
              wallets={wallets}
              categories={expenseCategories}
              type="expense"
            />
          </TabsContent>
          <TabsContent value="income">
            <AddTransactionForm
              wallets={wallets}
              categories={incomeCategories}
              type="income"
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
