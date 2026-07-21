import { Skeleton } from "@/components/ui/skeleton"

export default function loading() {
  return (
    <div className="space-y-4 px-4">
      <Skeleton className="h-12 w-full" />
      {Array.from({ length: 4 }).map((_, i) => (
        <section key={i} className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-36 w-full" />
        </section>
      ))}
    </div>
  )
}
