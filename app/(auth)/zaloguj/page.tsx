import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Zaloguj - Mathilo",
  description: "Zaloguj się do naszej platformy!",
}

export default function LoginPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Zaloguj się</h1>
        <p className="text-gray-600 mt-2">Witaj ponownie! Zaloguj się, aby kontynuować.</p>
      </div>
      <LoginForm />
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Nie masz jeszcze konta?{" "}
          <Link href="/zarejestruj" className="text-violet-600 hover:text-violet-800 font-medium">
            Zarejestruj się
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/przypomnij-haslo" className="text-violet-600 hover:text-violet-800 font-medium">
            Zapomniałeś hasła?
          </Link>
        </p>
      </div>
    </div>
  )
}

