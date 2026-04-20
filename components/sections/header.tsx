import Image from "next/image"
import { Button } from "../ui/button"
import { Bell, ChevronDown } from "lucide-react"

import { createClient } from "@/lib/supabase/server"

const Header = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const avatar = user?.user_metadata?.avatar_url

  return (
    <section className="z-10 flex h-16 w-full items-center justify-between">
      <div className="relative h-10 w-10 rounded-full border-2 border-primary">
        <Image
          src={avatar}
          alt="Logo"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <Button size="sm" className="text-card font-medium">
        November 2021 <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
      <Button size="icon" className="h-10 w-10">
        <Bell />
      </Button>
    </section>
  )
}

export default Header
