import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import PageHeader from "@/components/global/page-header"
import CategoryForm from "@/features/category/components/category-form"
import { createCategory } from "@/features/category/lib/actions/create-category"

export const metadata: Metadata = {
  title: "Budgetin - Create Category",
  description: "Create Category",
}

export default async function NewCategoryPage() {
  const t = await getTranslations("category.new")

  return (
    <div>
      <PageHeader title={t("header_title")} backHref="/category" />
      <main className="p-4">
        <CategoryForm mode="create" onSubmitAction={createCategory} />
      </main>
    </div>
  )
}
