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
    <div
      className={cn(
        stickyBottom &&
          "pointer-events-none fixed inset-x-0 bottom-4 w-full max-w-lg mx-auto z-20 px-2",
        className
      )}
    >
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
        className="pointer-events-auto mx-auto flex h-14 w-full items-center rounded-full bg-primary px-3 shadow-xl"
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
                    "flex h-10 w-full items-center justify-center rounded-full px-4 transition-all duration-200",
                    isActive
                      ? "gap-2 bg-primary-foreground text-primary"
                      : "text-primary-foreground/75 hover:bg-white/10 hover:text-primary-foreground"
                  )}
                >
                  <Icon size={22} strokeWidth={2} aria-hidden />

                  <motion.div
                    initial={false}
                    animate={{
                      width: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                      marginLeft: isActive ? 6 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 32,
                    }}
                    className="overflow-hidden"
                  >
                    <span
                      className={cn(
                        "text-xs font-semibold whitespace-nowrap",
                        isActive ? "text-primary" : "text-primary-foreground"
                      )}
                    >
                      {t(item.key)}
                    </span>
                  </motion.div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.nav>
    </div>
  )
}

export default BottomNavBar
