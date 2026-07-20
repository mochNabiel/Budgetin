import { Button } from "@/components/ui/button"
import { cn } from "@/shared/utils"
import { ITransaction } from "@/features/transaction/lib/queries/get-transactions"
import { Link } from "@/i18n/navigation"
import { Pencil } from "lucide-react"

interface Props {
  transaction: ITransaction
}

export default function EditTransactionButton({ transaction }: Props) {
  const isIncome = transaction.type === "income"
  return (
    <Button
      className={cn(
        "h-12 flex-1 text-primary-foreground",
        isIncome
          ? "bg-chart-2 hover:bg-chart-2/90"
          : "bg-primary hover:bg-primary/90"
      )}
      asChild
    >
      <Link href={`/transaction/${transaction.id}/edit`}>
        <Pencil className="size-4" />
        Edit
      </Link>
    </Button>
  )
}
