import Image from "next/image"
import { Button } from "../ui/button"
import { Bell, ChevronDown } from "lucide-react"

import { createClient } from "@/lib/supabase/server"

const Navbar = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const avatar = user?.user_metadata?.avatar_url

  return (
    <section className="z-10 flex h-16 w-full items-center justify-between p-4">
      <div className="relative h-10 w-10 rounded-full border-2 border-primary">
        <Image
          src={avatar}
          alt="Logo"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="bg-card/40 text-xs backdrop-blur-sm"
      >
        November 2021 <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-10 w-10 bg-card/40 backdrop-blur-sm"
      >
        <Bell />
      </Button>
    </section>
  )
}

export default Navbar
