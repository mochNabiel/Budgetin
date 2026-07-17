interface Props {
  children: React.ReactNode
}

export default function AuthContainer({ children }: Props) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <main className="w-full max-w-md space-y-4 rounded-4xl border border-border p-4">
        {children}
      </main>
    </div>
  )
}
