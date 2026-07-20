import { SectionHeader } from "@/components/global/section-header"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { getUserData } from "@/features/auth/lib/queries/get-user-data"
import { Link } from "@/i18n/navigation"
import { Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import BalanceText from "./balance-text"
import { getWallets } from "@/features/wallet/lib/queries"


export default async function WalletsSection() {
  const wallets = await getWallets()
  const t = await getTranslations("home")
  const { currency } = await getUserData()

  return (
    <section>
      <SectionHeader
        title={t("wallets.title")}
        action={
          <Button variant="link" className="h-fit" asChild>
            <Link href="/wallet">{t("view_all")}</Link>
          </Button>
        }
      />
      <div className="flex scrollbar-none gap-3 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {wallets.map((wallet) => (
          <Link key={wallet.id} href={`/wallet/${wallet.id}`}>
            <Item
              variant="outline"
              className="flex w-fit border-none flex-col items-start gap-2 px-6 transition-opacity hover:opacity-80"
              style={{
                backgroundColor: `${wallet.color}30`,
              }}
            >
              <ItemMedia
                variant="icon"
                className="size-9 rounded-full text-lg"
                style={{ backgroundColor: wallet.color }}
              >
                {wallet.icon}
              </ItemMedia>

              <ItemContent className="gap-0">
                <ItemTitle className="w-full truncate text-sm font-light">
                  {wallet.name}
                </ItemTitle>

                <ItemDescription className="w-full text-lg font-semibold whitespace-nowrap text-foreground">
                  <BalanceText amount={wallet.balance} currency={currency} />
                </ItemDescription>
              </ItemContent>
            </Item>
          </Link>
        ))}

        <Button
          variant="ghost"
          className="h-auto w-44 shrink-0 rounded-xl border-2 border-dashed border-muted-foreground/30 p-4 hover:border-primary hover:bg-primary/5"
          asChild
        >
          <Link href="/wallet/new">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="size-5" />
              </div>

              <span className="font-medium">{t("wallets.add_wallet")}</span>
            </div>
          </Link>
        </Button>
      </div>
    </section>
  )
}
