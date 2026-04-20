import { ArrowUp, EyeOff } from "lucide-react"

const CurrentBalance = () => {
  return (
    <section className="relative flex w-full items-center justify-center pt-8 pb-12">
      <div className="flex h-full w-full flex-col justify-center gap-2 rounded-4xl bg-card-foreground">
        <div className="flex items-center gap-3">
          <p className="text-md font-medium tracking-wide text-primary-foreground">
            Saldo Kamu
          </p>
          <EyeOff className="h-4 w-4 text-primary-foreground" />
        </div>

        <p className="text-4xl font-bold text-primary-foreground">
          <span className="text-primary">Rp </span>10.000.000
        </p>

        <div className="flex items-center gap-1 text-primary-foreground">
          <ArrowUp className="h-3 w-3" />
          <p className="text-xs">
            <span>5%</span> dari bulan lalu
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-card"></div>
    </section>
  )
}

export default CurrentBalance
