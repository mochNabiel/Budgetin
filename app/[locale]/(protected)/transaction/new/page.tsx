import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddTransactionForm from "@/features/transaction/components/add-transaction-form"
import { getWallets } from "@/features/wallet/lib/queries"
import { ChevronLeft } from "lucide-react"
import { Suspense } from "react"

export default async function page() {
  const wallets = getWallets()
  return (
    <div>
      <header className="relative flex h-14 items-center px-2">
        <Button variant="ghost" size="icon" className="absolute left-2">
          <ChevronLeft className="size-6" />
        </Button>

        <h1 className="mx-auto text-center font-medium">
          Add New Transaction
        </h1>
      </header>
      <main className="p-2">
        <Tabs defaultValue="expense" className="w-full rounded-xl">
          <TabsList className="mb-2 w-full rounded-xl border border-input py-6">
            <TabsTrigger
              value="expense"
              className="py-5 data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground dark:data-active:bg-primary"
            >
              Expense
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="py-5 data-active:bg-chart-2 data-active:text-primary-foreground hover:data-active:text-primary-foreground dark:data-active:bg-chart-2"
            >
              Income
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <Suspense
              fallback={
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Loading</span>
                </div>
              }
            >
              <AddTransactionForm wallets={wallets} type="expense" />
            </Suspense>
          </TabsContent>
          <TabsContent value="income">
            <Suspense
              fallback={
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Loading</span>
                </div>
              }
            >
              <AddTransactionForm wallets={wallets} type="income" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
