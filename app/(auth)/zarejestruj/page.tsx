import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Zarejestruj - Mathilo",
  description: "Stwórz konto na platformę Mathilo.",
}

export default function RegisterPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Utwórz konto</h1>
        <p className="text-gray-600 mt-2">Dołącz do nas i rozpocznij naukę już dziś!</p>
      </div>
      <RegisterForm />
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Masz już konto?{" "}
          <Link href="/zaloguj" className="text-violet-600 hover:text-violet-800 font-medium">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  )
}

