import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item"
import { History } from "lucide-react"

const TransactionHistory = () => {
  return (
    <section className="px-4">
      <h1 className="text-lg font-semibold text-primary mb-2">
        Transaction History
      </h1>
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((item, index) => {
          return (
            <Item key={index} className="shadow-sm">
              <ItemMedia variant="icon">
                <History />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Title</ItemTitle>
                <ItemDescription>Description</ItemDescription>
              </ItemContent>
              <ItemActions>
                <p className="text-destructive">- Rp 100.000</p>
              </ItemActions>
            </Item>
          )
        })}
      </div>
    </section>
  )
}

export default TransactionHistory
