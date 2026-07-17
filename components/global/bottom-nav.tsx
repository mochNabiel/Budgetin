"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { navItems } from "@/constants/nav-items"
import { cn } from "@/shared/utils"

type BottomNavBarProps = {
  className?: string
  stickyBottom?: boolean
}

export function BottomNavBar({
  className,
  stickyBottom = true,
}: BottomNavBarProps) {
  const pathname = usePathname()
  const t = useTranslations("bottomNavBar")

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 26,
      }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        "bg-background-30 flex h-14 w-full max-w-lg items-center rounded-full border border-border px-3 shadow-sm backdrop-blur-xl",
        stickyBottom && "fixed inset-x-0 bottom-4 z-20 mx-auto max-w-lg",
        className
      )}
    >
      <div className="flex w-full items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.key} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "flex h-10 w-full items-center justify-center rounded-full px-3 transition-colors",
                  isActive
                    ? "gap-2 bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/70"
                )}
              >
                <Icon size={22} strokeWidth={2} aria-hidden />

                <motion.div
                  initial={false}
                  animate={{
                    width: isActive ? "auto" : 0,
                    opacity: isActive ? 1 : 0,
                    marginLeft: isActive ? 2 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 32,
                  }}
                  className="overflow-hidden"
                >
                  <span className="text-xs font-medium whitespace-nowrap">
                    {t(item.key)}
                  </span>
                </motion.div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}

export default BottomNavBar
