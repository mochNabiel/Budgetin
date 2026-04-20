import { LayoutDashboard, PieChart, Plus } from "lucide-react"
import Link from "next/link"

const BottomNav = () => {
  return (
    <nav className="fixed bottom-4 flex h-16 w-fit bg-card-foreground/40 backdrop-blur-lg -translate-x-1/2 left-1/2 items-center justify-center rounded-full">
      <ul className="flex w-full items-center justify-between px-8 gap-4">
        <li>
          <Link href="/protected">
            <LayoutDashboard className="text-card"/>
          </Link>
        </li>
        <li className="rounded-full bg-primary p-3">
          <Link href="/protected/add">
            <Plus className="w-8 h-8 text-card"/>
          </Link>
        </li>
        <li>
          <Link href="/protected/report">
            <PieChart className="text-card"/>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default BottomNav
