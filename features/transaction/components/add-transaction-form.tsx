"use client"

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { defaultCategories } from "@/shared/data"
import { formatThousands } from "@/shared/helper/format-thousand"
import { cn } from "@/shared/utils"
import { IWallet } from "@/types/wallet"
import { Mic, Save } from "lucide-react"
import { use } from "react"
import { Controller, useForm } from "react-hook-form"
import DateField from "./date-field"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface Props {
  wallets: Promise<IWallet[]>
  type: "income" | "expense"
}

export default function AddTransactionForm({ wallets, type }: Props) {
  const allWallets = use(wallets)
  const isIncome = type === "income"

  const categories = defaultCategories.filter(
    (category) => category.type === type
  )

  const { handleSubmit, control } = useForm({
    defaultValues: {
      amount: 0,
      wallet: allWallets[0].name || "",
      category: "",
      date: new Date(),
      notes: "",
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
  }

  const formId = `add-trx-form-${type}`

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="pb-28">
      <FieldGroup className="gap-4">
        <Controller
          name="amount"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel
                htmlFor={`${formId}-amount`}
                className="text-base font-normal"
              >
                Amount
              </FieldLabel>
              <Input
                {...field}
                id={`${formId}-amount`}
                aria-invalid={fieldState.invalid}
                className="rounded-xl py-6"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="wallet"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="gap-2">
              <FieldLabel className="text-base font-normal">Wallet</FieldLabel>

              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                className="flex w-full scrollbar-none gap-3 overflow-x-auto"
              >
                {allWallets.map((wallet, index) => (
                  <label
                    key={`${wallet.id}-${index}`}
                    htmlFor={`${formId}-wallet-${index}`}
                    className={cn(
                      "shrink-0 cursor-pointer rounded-xl border p-4 transition-colors",
                      isIncome
                        ? "has-data-[state=checked]:border-chart-2 has-data-[state=checked]:bg-chart-2/5"
                        : "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                    )}
                  >
                    <RadioGroupItem
                      id={`${formId}-wallet-${index}`}
                      value={wallet.name}
                      className="hidden"
                      aria-invalid={fieldState.invalid}
                    />

                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-10 items-center justify-center rounded-full text-lg"
                        style={{ backgroundColor: wallet.color }}
                      >
                        {wallet.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium whitespace-nowrap">
                          {wallet.name}
                        </p>

                        <p className="text-sm whitespace-nowrap text-muted-foreground">
                          {formatThousands(String(wallet.balance))}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldContent>
                <FieldLabel
                  htmlFor={`${formId}-category`}
                  className="text-base font-normal"
                >
                  Category
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={`${formId}-category`}
                  aria-invalid={fieldState.invalid}
                  className="w-full rounded-xl py-6"
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.name}
                      value={category.name}
                      className="capitalize"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="flex size-8 items-center justify-center rounded-full text-lg"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <DateField field={field} fieldState={fieldState} type={type} />
          )}
        />

        <Controller
          name="notes"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel
                htmlFor={`${formId}-notes`}
                className="text-base font-normal"
              >
                Notes
              </FieldLabel>
              <Textarea
                {...field}
                id={`${formId}-notes`}
                aria-invalid={fieldState.invalid}
                placeholder="One pair of Adidas Shoes"
                className="min-h-30"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="fixed inset-x-2 max-w-lg mx-auto bottom-4 z-50 flex items-center gap-2 py-2">
        <Button
          type="button"
          size="icon"
          className={cn(
            "size-12 shrink-0 text-primary-foreground",
            isIncome
              ? "bg-chart-2 hover:bg-chart-2/90"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          <Mic className="size-5" />
        </Button>

        <Button
          type="submit"
          form={formId}
          className={cn(
            "h-12 flex-1 text-base text-primary-foreground",
            isIncome
              ? "bg-chart-2 hover:bg-chart-2/90"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          <Save className="size-5" />
          Save {isIncome ? "Income" : "Expense"}
        </Button>
      </div>
    </form>
  )
}
