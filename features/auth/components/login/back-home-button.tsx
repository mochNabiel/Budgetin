import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ChevronLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"

interface Props {
  locale: string
}

export default async function BackHomeButton({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "auth.login" })
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
