"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"

import { Link, usePathname } from "@/i18n/navigation"
import { navItems } from "@/constants/nav-items"
import { cn } from "@/shared/utils"
import AddActionSheet from "./add-action-sheet"

type BottomNavBarProps = {
  className?: string
  stickyBottom?: boolean
  walletCount: number
}

export function BottomNavBar({
  className,
  stickyBottom = true,
  walletCount,
}: BottomNavBarProps) {
  const pathname = usePathname()

  const firstHalf = navItems.slice(0, Math.ceil(navItems.length / 2))
  const secondHalf = navItems.slice(Math.ceil(navItems.length / 2))

  return (
    <div
      className={cn(
        stickyBottom &&
          "pointer-events-none fixed inset-x-0 bottom-4 z-20 mx-auto w-full max-w-lg px-2",
        className
      )}
    >
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        role="navigation"
        aria-label="Bottom Navigation"
        className="pointer-events-auto mx-auto flex h-16 w-fit items-center gap-4 rounded-full bg-foreground px-2 shadow-lg"
      >
        {firstHalf.map((item) => (
          <NavLink key={item.key} item={item} pathname={pathname} />
        ))}

        <AddActionSheet walletCount={walletCount}>
          <button
            type="button"
            aria-label="add-btn"
            className="relative flex size-14 shrink-0 items-center justify-center"
          >
            <motion.span
              whileTap={{ scale: 0.92 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 22,
                delay: 0.1,
              }}
              className="-mt-8 flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            >
              <Plus size={26} strokeWidth={2.5} aria-hidden />
            </motion.span>
          </button>
        </AddActionSheet>

        {secondHalf.map((item) => (
          <NavLink key={item.key} item={item} pathname={pathname} />
        ))}
      </motion.nav>
    </div>
  )
}

function NavLink({
  item,
  pathname,
}: {
  item: (typeof navItems)[number]
  pathname: string
}) {
  const Icon = item.icon
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className="relative flex size-12 shrink-0 items-center justify-center"
    >
      {isActive && (
        <motion.span
          layoutId="bottom-nav-active-pill"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="absolute inset-0 m-auto size-11 rounded-full bg-background shadow-sm"
        />
      )}
      <motion.span
        whileTap={{ scale: 0.9 }}
        className={cn(
          "relative z-10 flex items-center justify-center",
          isActive ? "text-foreground" : "text-background/50"
        )}
      >
        <Icon size={20} strokeWidth={2} aria-hidden />
      </motion.span>
    </Link>
  )
}

export default BottomNavBar
