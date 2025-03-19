import type { Metadata } from "next"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Przypomnij hasło - Mathilo",
  description: "Zapomniałeś hasła do naszej platformy? Przypomnij je tutaj!",
}

export default function ForgotPasswordPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Odzyskaj hasło</h1>
        <p className="text-gray-600 mt-2">Podaj swój adres email, a wyślemy Ci link do zresetowania hasła.</p>
      </div>
      <ForgotPasswordForm />
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Pamiętasz hasło?{" "}
          <Link href="/zaloguj" className="text-violet-600 hover:text-violet-800 font-medium">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  )
}

