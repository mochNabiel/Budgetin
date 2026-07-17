"use client"

import { useRouter } from "@/i18n/navigation"
import { Button } from "../ui/button"

const LoginButton = () => {
  const router = useRouter()
  return (
    <Button className="w-full" onClick={() => router.push("/auth/login")}>
      Login
    </Button>
  )
}

export default LoginButton
