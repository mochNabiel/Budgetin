import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { cn } from "@/shared/utils"
import { ICategory } from "@/types/category"
import { ChevronRight, Inbox } from "lucide-react"
import { getTranslations } from "next-intl/server"

interface Props {
  categories: ICategory[]
}

export default async function CategoryList({ categories }: Props) {
  const t = await getTranslations("category")

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
        <Inbox className="size-8" />
        <p className="text-sm">{t("no_category")}</p>
      </div>
    )
  }

  return (
    <Card size="sm" className="data-[size=sm]:py-0">
      <CardContent className="divide-y divide-border/60">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40"
          >
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl"
              style={{ backgroundColor: category.color }}
            >
              {category.icon}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{category.name}</p>
              <p
                className={cn(
                  "text-xs font-medium capitalize",
                  category.type === "income" ? "text-chart-2" : "text-primary"
                )}
              >
                {category.type}
              </p>
            </div>

            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
