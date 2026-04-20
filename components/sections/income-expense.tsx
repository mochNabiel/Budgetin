import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ChevronRight, CreditCard, Wallet } from "lucide-react"
import Link from "next/link"

const IncomeExpense = () => {
  return (
    <section className="flex gap-3 px-4">
      <Item className="flex flex-col items-start shadow-sm">
        <span className="flex w-full items-start justify-between">
          <ItemMedia
            className="rounded-full border border-[#36E051] bg-[#36E051]/20 p-3 text-[#36E051]"
            variant="icon"
          >
            <Wallet />
          </ItemMedia>
          <Link
            href="/protected/income"
            className="mt-1 flex items-center gap-1 text-xs text-[#36E051]"
          >
            Detail <ChevronRight className="h-3 w-3" />
          </Link>
        </span>
        <ItemContent>
          <ItemTitle>Income</ItemTitle>
          <ItemDescription className="font-bold text-lg text-card-foreground">Rp 7.200.000</ItemDescription>
        </ItemContent>
      </Item>
      <Item className="flex flex-col items-start shadow-sm">
        <span className="flex w-full items-start justify-between">
          <ItemMedia
            className="rounded-full border border-destructive bg-destructive/20 p-3 text-destructive"
            variant="icon"
          >
            <CreditCard />
          </ItemMedia>
          <Link
            href="/protected/expense"
            className="mt-1 flex items-center gap-1 text-xs text-primary"
          >
            Detail <ChevronRight className="h-3 w-3" />
          </Link>
        </span>
        <ItemContent>
          <ItemTitle>Expense</ItemTitle>
          <ItemDescription className="font-bold text-lg text-card-foreground">Rp 2.800.000</ItemDescription>
        </ItemContent>
      </Item>
    </section>
  )
}

export default IncomeExpense
