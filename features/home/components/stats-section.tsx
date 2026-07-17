import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import formatCurrency from "@/shared/helper/format-currency"
import { ArrowDownLeft, ArrowUpRight, Eye } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function StatsSection() {
  const t = await getTranslations("home.stats")
  const balance = 200000
  const income = 450000
  const expense = 250000

  return (
    <Card size="sm" className="bg-primary ring-0">
      <CardHeader>
        <CardTitle className="text-xs tracking-wide text-primary-foreground uppercase">
          {t("total_balance")}
        </CardTitle>
        <CardDescription className="text-3xl font-bold text-primary-foreground">
          {formatCurrency(balance)}
        </CardDescription>
        <CardAction>
          <Eye className="text-primary-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Item variant="muted" className="bg-background">
          <ItemMedia
            variant="icon"
            className="rounded-full bg-chart-2/20 p-2 text-chart-2"
          >
            <ArrowUpRight />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-xs font-normal tracking-wide text-muted-foreground">
              {t("income")}
            </ItemTitle>
            <ItemDescription className="font-semibold text-foreground">
              {formatCurrency(income)}
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted" className="bg-background">
          <ItemMedia
            variant="icon"
            className="rounded-full bg-destructive/20 p-2 text-destructive"
          >
            <ArrowDownLeft />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-xs font-normal tracking-wide text-muted-foreground">
              {t("expense")}
            </ItemTitle>
            <ItemDescription className="font-semibold text-foreground">
              {formatCurrency(expense)}
            </ItemDescription>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  )
}
