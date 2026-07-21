import { Skeleton } from "@/components/ui/skeleton"

export default function loading() {
  return (
    <div className="space-y-4 px-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-48 w-full" />
      {Array.from({ length: 4 }).map((_, i) => (
        <section key={i} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-36 w-full" />
        </section>
      ))}
    </div>
  )
}
