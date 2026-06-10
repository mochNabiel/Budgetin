"use client"

import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

interface Props {
  value: string
  type: "income" | "expense"
}

export function AnimatedCounter({ value, type }: Props) {
  return (
    <div
      className={cn(
        "flex justify-center overflow-hidden text-5xl font-bold tracking-tight",
        type === "income" ? "text-chart-2" : "text-primary"
      )}
    >
      {value.split("").map((char, index) => (
        <Digit key={`${index}-${char}`} digit={char} />
      ))}
    </div>
  )
}

function Digit({ digit }: { digit: string }) {
  return (
    <div className="relative h-[1em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{
            y: "100%",
            opacity: 0,
          }}
          animate={{
            y: "0%",
            opacity: 1,
          }}
          exit={{
            y: "-100%",
            opacity: 0,
          }}
          transition={{
            duration: 0.18,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
