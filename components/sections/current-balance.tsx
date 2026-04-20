import { Badge } from "../ui/badge"

const CurrentBalance = () => {
  return (
    <section className="flex w-full items-center justify-center px-4 pb-12">
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-4xl bg-card-foreground pt-10 pb-16">
        <p className="text-xs font-medium text-primary">Saldo Saat Ini</p>
        <p className="text-4xl font-bold text-primary">Rp 10.000.000</p>

        <div className="translate-y-1/2 absolute bottom-0 h-20 w-4/5 rounded-3xl bg-card">
            
        </div>
      </div>
    </section>
  )
}

export default CurrentBalance
