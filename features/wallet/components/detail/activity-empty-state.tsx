import { Inbox } from "lucide-react"

function ActivityEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
      <Inbox className="size-8" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default ActivityEmptyState

