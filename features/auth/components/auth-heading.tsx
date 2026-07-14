import { cn } from "@/shared/utils"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"

interface Props {
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
}

export default function AuthHeading({ title, description, className }: Props) {
  return (
    <Field
      className={cn("flex flex-col items-center gap-0 text-center", className)}
    >
      <FieldLabel className="w-full justify-center gap-1 text-center text-xl font-bold">
        {title}
      </FieldLabel>

      {description && (
        <FieldDescription className="text-center">
          {description}
        </FieldDescription>
      )}
    </Field>
  )
}
