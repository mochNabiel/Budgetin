interface Props {
  label: string
  children: React.ReactNode
}

export default function DetailRow({ label, children }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
