import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Resetuj hasło - Mathilo",
  description: "Zresetuj swoje hasło, jeśli je zapomniałeś.",
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  // For Supabase, we don't need to extract the token from the URL
  // as it's handled by the auth helpers

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Ustaw nowe hasło</h1>
        <p className="text-gray-600 mt-2">Wprowadź nowe hasło dla swojego konta.</p>
      </div>
      <ResetPasswordForm />
    </div>
  )
}

