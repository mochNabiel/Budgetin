import { getUserData } from "@/features/auth/lib/queries"
import { getWallets } from "@/features/wallet/lib/queries"
import formatCurrency from "@/shared/helper/format-currency"
import EditWalletDialog from "./edit-wallet-dialog"
import DeleteWalletButton from "./delete-wallet-button"

export default async function WalletList() {
  const { currency } = await getUserData()
  const wallets = await getWallets()

  return (
    <div className="flex flex-col gap-2">
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          className="flex items-center gap-3 rounded-xl border p-4"
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

          <EditWalletDialog wallet={wallet} />
          <DeleteWalletButton walletId={wallet.id} walletName={wallet.name} />
        </div>
      ))}
    </div>
  )
}
