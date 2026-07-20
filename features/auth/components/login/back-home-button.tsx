import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ChevronLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function BackHomeButton() {
  const t = await getTranslations("auth.login")
  return (
    <Button
      variant="link"
      className="flex h-fit w-full items-center justify-center gap-2"
      asChild
    >
      <Link href="/">
        <ChevronLeft />
        <span>{t("back_home")}</span>
      </Link>
    </Button>
  )
}
