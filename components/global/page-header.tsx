"use client"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ChevronLeft } from "lucide-react"

interface Props {
  title: string
  backHref?: string
  right?: React.ReactNode
}

export default function PageHeader({
  title,
  backHref = "/home",
  right,
}: Props) {
  return (
    <header className="sticky top-0 z-50 bg-background flex h-14 items-center px-2">
      <Button variant="ghost" size="icon" className="absolute left-2" asChild>
        <Link href={backHref}>
          <ChevronLeft className="size-6" />
        </Link>
      </Button>

      <h1 className="mx-auto text-center font-medium">{title}</h1>

      {right && <div className="absolute right-2">{right}</div>}
    </header>
  )
}
