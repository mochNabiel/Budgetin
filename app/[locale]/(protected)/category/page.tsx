import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import PageHeader from "@/components/global/page-header"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { Plus } from "lucide-react"
import { getCategories } from "@/features/category/lib/queries/get-categories"
import CategoryList from "@/features/category/components/category-list"
import CategoryFilterTabs from "@/features/category/components/category-filter-tabs"

export const metadata: Metadata = {
  title: "Budgetin - Category",
  description: "Category",
}

interface PageProps {
  searchParams: Promise<{ type?: "all" | "income" | "expense" }>
}

export default async function CategoryPage({ searchParams }: PageProps) {
  const t = await getTranslations("category")
  const sp = await searchParams
  const categories = await getCategories()
  const filter = sp.type ?? "all"

  return (
    <div>
      <PageHeader title={t("list.header_title")} backHref="/home" />

      <main className="flex flex-col gap-4 p-4">
        <Button className="h-12 w-full" asChild>
          <Link href="/category/new" className="flex items-center gap-2">
            <Plus />
            {t("add_category")}
          </Link>
        </Button>

        <CategoryFilterTabs currentFilter={filter} />
        <CategoryList categories={categories} filter={filter} />
      </main>
    </div>
  )
}
