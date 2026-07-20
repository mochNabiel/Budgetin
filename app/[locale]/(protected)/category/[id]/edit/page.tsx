import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import PageHeader from "@/components/global/page-header"
import CategoryForm from "@/features/category/components/category-form"
import { getCategoryDetail } from "@/features/category/lib/queries/get-category-detail"
import { updateCategory } from "@/features/category/lib/actions/update-category"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Budgetin - Edit Category",
  description: "Edit Category",
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params
  const t = await getTranslations("category.edit")

  let category
  try {
    category = await getCategoryDetail(Number(id))
  } catch {
    notFound()
  }

  return (
    <div>
      <PageHeader title={t("header_title")} backHref={`/category/${id}`} />
      <main className="p-4">
        <CategoryForm
          mode="edit"
          defaultValues={{
            type: category.type,
            name: category.name,
            icon: category.icon,
            color: category.color,
          }}
          onSubmitAction={updateCategory.bind(null, category.id)}
        />
      </main>
    </div>
  )
}
