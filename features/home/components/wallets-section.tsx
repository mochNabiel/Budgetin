import { SectionHeader } from "@/components/global/section-header"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Link } from "@/i18n/navigation"
import formatCurrency from "@/shared/helper/format-currency"
import { IWallet } from "@/types/wallet"
import { Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"

interface Props {
  wallets: IWallet[]
}

export default async function WalletsSection({ wallets }: Props) {
  const t = await getTranslations("home.wallets")
  return (
    <section>
      <SectionHeader title={t("title")} />
      <div className="flex scrollbar-none gap-3 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {wallets.map((wallet) => (
          <Item
            key={wallet.id}
            variant="outline"
            className="flex min-w-48 flex-col items-start gap-2 px-6"
          >
            <ItemMedia
              variant="icon"
              className="size-9 text-lg rounded-full"
              style={{ backgroundColor: wallet.color }}
            >
              {wallet.icon}
            </ItemMedia>

            <ItemContent className="gap-0">
              <ItemTitle className="text-xs font-medium tracking-wide text-mist-500">
                {wallet.name}
              </ItemTitle>
              <ItemDescription className="text-lg font-semibold text-mist-950">
                {formatCurrency(wallet.balance)}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}

        <Button
          variant="ghost"
          className="h-auto w-44 shrink-0 rounded-xl border-2 border-dashed border-muted-foreground/30 p-4 hover:border-primary hover:bg-primary/5"
          asChild
        >
          <Link href="/wallets/new">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="size-5" />
              </div>

              <span className="font-medium">{t("add_wallet")}</span>
            </div>
          </Link>
        </Button>
      </div>
    </section>
  )
}
