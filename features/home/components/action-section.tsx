import { SectionHeader } from "@/components/global/section-header"
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
          const isPrimary = item.variant === "primary"

          return (
            <Link key={item.key} href={item.link} className="block">
              <div
                className={cn(
                  "flex h-24 items-center gap-3 rounded-2xl border p-4 text-left transition-all hover:bg-muted hover:shadow-sm active:scale-[0.98]",
                  isPrimary &&
                    "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                    isPrimary ? "bg-white/15" : "bg-primary/10 text-primary"
                  )}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>

                <span
                  className={cn(
                    "text-sm leading-tight font-semibold",
                    !isPrimary && "text-foreground"
                  )}
                >
                  {t(item.key)}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
