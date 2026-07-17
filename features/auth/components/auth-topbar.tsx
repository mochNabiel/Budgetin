import LocaleToggle from "@/components/global/locale-toggle"
import ThemeToggle from "@/components/global/theme-toggle"
import Image from "next/image"

export default function AuthTopbar() {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="relative size-6">
        <Image
          src="/icons/logo.svg"
          alt="Logo Budgetin"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LocaleToggle />
      </div>
    </div>
  )
}
