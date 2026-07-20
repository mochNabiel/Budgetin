import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import PageHeader from "@/components/global/page-header"
import { getCategoryDetail } from "@/features/category/lib/queries/get-category-detail"
import CategoryDetail from "@/features/category/components/detail/category-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Budgetin - Category Detail",
  description: "Category Detail",
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { id } = await params
  const t = await getTranslations("category.detail")

  let category
  try {
    category = await getCategoryDetail(Number(id))
  } catch {
    notFound()
  }

  return (
    <div>
      <PageHeader title={t("header_title")} backHref="/category" />
      <CategoryDetail category={category} />
    </div>
  )
}
