import { getUserData } from "@/features/auth/lib/queries"
import { getWallets } from "@/features/wallet/lib/queries"
import formatCurrency from "@/shared/helper/format-currency"
import { Link } from "@/i18n/navigation"
import { ChevronRight } from "lucide-react"

export default async function WalletList() {
  const { currency } = await getUserData()
  const wallets = await getWallets()

  return (
    <div className="flex flex-col gap-2">
      {wallets.map((wallet) => (
        <Link
          key={wallet.id}
          href={`/wallet/${wallet.id}`}
          className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/40"
          style={{
            backgroundColor: `${wallet.color}30`,
            borderColor: wallet.color,
          }}
        >
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl"
            style={{ backgroundColor: wallet.color }}
          >
            {wallet.icon}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{wallet.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(wallet.balance, currency)}
            </p>
          </div>

          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      ))}
    </div>
  )
}
