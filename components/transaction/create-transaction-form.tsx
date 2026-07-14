"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Check,
  ChevronDown,
  Pencil,
  Receipt,
  ShoppingBag,
  Smartphone,
  Target,
  Utensils,
  X,
} from "lucide-react"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { cn } from "@/shared/utils"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "./animated-counter"

const formSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().min(1),
  category: z.string().min(1),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  transactionId?: string
}

const categories = [
  {
    id: "shopping",
    label: "Belanja",
    icon: ShoppingBag,
    color: "bg-pink-100 text-pink-600 border-pink-300",
  },
  {
    id: "transport",
    label: "Transport",
    icon: Receipt,
    color: "bg-blue-100 text-blue-600 border-blue-300",
  },
  {
    id: "food",
    label: "Makanan",
    icon: Utensils,
    color: "bg-green-100 text-green-600 border-green-300",
  },
  {
    id: "target",
    label: "Target",
    icon: Target,
    color: "bg-purple-100 text-purple-600 border-purple-300",
  },
  {
    id: "phone",
    label: "Phone",
    icon: Smartphone,
    color: "bg-cyan-100 text-cyan-600 border-cyan-300",
  },
]

export function CreateTransactionForm({ transactionId }: Props) {
  const isEdit = !!transactionId

  const [displayAmount, setDisplayAmount] = useState("0")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      category: "",
      note: "",
    },
  })

  const amount = form.watch("amount")
  const selectedCategory = form.watch("category")
  const type = form.watch("type")

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat("id-ID").format(amount || 0)
  }, [amount])

  const onSubmit = (values: FormValues) => {
    console.log(values)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto flex h-full max-w-md flex-col bg-background"
    >
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-8">
          {/* TYPE */}
          <FieldSet>
            <Field>
              <FieldContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={type === "income" ? "default" : "outline"}
                    className={cn(
                      "h-12 rounded-2xl",
                      type === "income" && "bg-chart-2 hover:bg-chart-2"
                    )}
                    onClick={() => form.setValue("type", "income")}
                  >
                    <ArrowUp className="size-4" />
                    Income
                  </Button>

                  <Button
                    type="button"
                    variant={type === "expense" ? "default" : "outline"}
                    className={cn(
                      "h-12 rounded-2xl",
                      type === "expense" && "bg-primary hover:bg-primary"
                    )}
                    onClick={() => form.setValue("type", "expense")}
                  >
                    <ArrowDown className="size-4" />
                    Expense
                  </Button>
                </div>
              </FieldContent>
            </Field>
          </FieldSet>

          {/* AMOUNT */}
          <FieldSet>
            <Field>
              <FieldLabel>Jumlah</FieldLabel>

              <FieldContent>
                <div className="rounded-3xl bg-muted/40 px-4 py-8 text-center">
                  <div className="mb-2 text-xl font-medium text-muted-foreground">
                    Rp
                  </div>

                  <AnimatedCounter value={formattedAmount} type={type} />
                </div>
              </FieldContent>
            </Field>
          </FieldSet>

          {/* CATEGORY */}
          <FieldSet>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Kategori</FieldLabel>

                <Button
                  variant="secondary"
                  type="button"
                  className="rounded-2xl"
                >
                  Tagihan
                  <ChevronDown className="size-4" />
                </Button>
              </div>

              <FieldContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    const isActive = selectedCategory === category.id

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => form.setValue("category", category.id)}
                        className="shrink-0"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={cn(
                              "flex size-16 items-center justify-center rounded-full border transition-all",
                              category.color,
                              isActive && "scale-105 ring-2 ring-offset-2"
                            )}
                          >
                            <Icon className="size-6" />
                          </div>

                          <span className="text-xs font-medium">
                            {category.label}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </FieldContent>
            </Field>
          </FieldSet>

          {/* DATE */}
          <FieldSet>
            <Field>
              <FieldLabel>Tanggal</FieldLabel>

              <FieldContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-pink-300 text-pink-500"
                  >
                    <Calendar className="size-4" />
                    Hari ini
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl"
                  >
                    <Calendar className="size-4" />
                    Kemarin
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl"
                  >
                    <Calendar className="size-4" />
                    Custom
                  </Button>
                </div>

                <Input
                  value="14 Mei 2026"
                  readOnly
                  className="mt-3 h-12 rounded-2xl border-0 bg-muted text-center font-medium"
                />
              </FieldContent>
            </Field>
          </FieldSet>

          {/* NOTE */}
          <FieldSet>
            <Field>
              <FieldLabel>Deskripsi</FieldLabel>

              <FieldDescription>Tambahkan catatan transaksi</FieldDescription>

              <FieldContent>
                <div className="relative">
                  <Pencil className="absolute top-4 left-4 size-4 text-muted-foreground" />

                  <Textarea
                    {...form.register("note")}
                    placeholder="Contoh: Belanja bulanan di supermarket"
                    className="min-h-28 rounded-3xl pl-11"
                    maxLength={100}
                  />
                </div>
              </FieldContent>
            </Field>
          </FieldSet>
        </div>
      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 border-t bg-background p-4">
        <Button
          type="submit"
          size="lg"
          className="h-14 w-full rounded-2xl text-base"
        >
          <Check className="size-5" />
          Simpan Transaksi
        </Button>
      </div>
    </form>
  )
}
