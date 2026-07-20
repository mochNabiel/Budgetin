import { getLocale, getTranslations } from "next-intl/server"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { getTransactions } from "@/features/transaction/lib/queries/get-transactions"
import { ICategoryDetail } from "@/features/category/lib/queries/get-category-detail"
import formatDate from "@/shared/helper/format-date"
import DetailRow from "./detail-row"
import DeleteCategoryButton from "./delete-category-button"
import TransactionList from "@/features/transaction/components/history/transaction-list"

interface Props {
  category: ICategoryDetail
}

export default async function CategoryDetail({ category }: Props) {
  const t = await getTranslations("category")
  const locale = await getLocale()
  const transactions = await getTransactions({ categoryId: category.id })

  return (
    <main className="flex flex-col gap-4 p-4">
      <section
        className="flex flex-col items-center gap-3 rounded-2xl border py-8"
        style={{
          borderColor: category.color,
          backgroundColor: `${category.color}30`,
        }}
      >
        <span
          className="flex size-16 items-center justify-center rounded-full text-3xl"
          style={{ backgroundColor: category.color }}
        >
          {category.icon}
        </span>

        <p className="text-sm text-muted-foreground">{category.name}</p>

        <p className="rounded-full bg-background/70 px-3 py-1 text-xs font-medium capitalize">
          {category.type}
        </p>

        <div className="flex flex-col items-center">
          <p className="text-xs text-muted-foreground">
            {t("created")} {formatDate(category.created_at, locale)}
          </p>
        </div>
      </section>

      <section className="flex flex-col divide-y divide-border rounded-2xl border">
        <DetailRow label={t("type")}>
          <span className="text-sm font-medium capitalize">{category.type}</span>
        </DetailRow>
        <DetailRow label={t("name")}>
          <span className="text-sm font-medium">{category.name}</span>
        </DetailRow>
        <DetailRow label={t("icon")}>
          <span className="text-sm font-medium">{category.icon}</span>
        </DetailRow>
      </section>

      <section className="flex flex-col gap-2">
        <p className="px-1 text-sm font-medium text-muted-foreground">
          {t("transactions")}
        </p>
        <TransactionList transactions={transactions} />
      </section>

      <section className="flex gap-2">
        <DeleteCategoryButton categoryId={category.id} />
        <Button className="h-12 flex-1" asChild>
          <Link href={`/category/${category.id}/edit`}>
            <Pencil className="size-4" />
            {t("update")}
          </Link>
        </Button>
      </section>
    </main>
  )
}
