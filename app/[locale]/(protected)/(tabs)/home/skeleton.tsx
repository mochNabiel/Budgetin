import { Skeleton } from "@/components/ui/skeleton"

export function HeaderSkeleton() {
  return <Skeleton className="h-12 w-full" />
}

export function BalanceSkeleton() {
  return <Skeleton className="h-48 w-full" />
}

export function SectionSkeleton() {
  return (
    <section className="flex flex-col gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-36 w-full" />
    </section>
  )
}
