import { SectionHeader } from "@/components/global/section-header"
import { Item } from "@/components/ui/item"
import { actionItems } from "@/constants/action-items"
import { Link } from "@/i18n/navigation"
import { cn } from "@/shared/utils"
import { getTranslations } from "next-intl/server"

export default async function ActionSection() {
  const t = await getTranslations("home.actions")

  return (
    <section className="space-y-3">
      <SectionHeader title={t("title")} />

      <div className="grid grid-cols-2 gap-3">
        {actionItems.map((item) => {
          const Icon = item.icon

          return (
            <Link key={item.key} href={item.link} className="block">
              <Item
                size="sm"
                className="flex flex-col border-none items-center justify-center py-4 shadow-sm bg-card"
              >
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full",
                    item.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-chart-2/10 text-chart-2"
                  )}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>

                <span
                  className={cn(
                    "font-medium text-base text-foreground"
                  )}
                >
                  {t(item.key)}
                </span>
              </Item>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
