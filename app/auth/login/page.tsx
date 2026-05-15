import { LoginForm } from '@/app/auth/login/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Budgetin - Login",
  description: "Login",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 lg:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

