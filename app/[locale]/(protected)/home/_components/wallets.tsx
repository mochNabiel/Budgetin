import { Plus } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getWallets } from "@/features/wallet/lib/queries"

export default async function Wallets() {
  const { data: wallets } = await getWallets()

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dompet</h2>

        <Button size="icon" variant="outline">
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {wallets?.map((wallet) => (
          <Card key={wallet.id} style={{ backgroundColor: wallet.color }}>
            <div className="flex items-center justify-between">
              <span className="text-3xl">{wallet.icon}</span>

              <span className="text-xs opacity-70">Wallet</span>
            </div>

            <div className="mt-6">
              <p className="text-sm opacity-80">{wallet.name}</p>

              <p className="text-2xl font-bold">
                Rp {wallet.balance.toLocaleString("id-ID")}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
