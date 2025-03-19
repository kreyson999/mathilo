import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Logowanie - Mathilo",
  description: "Zaloguj się, zarejestruj się lub przypomnij hasło do platformy.",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
        <div className="mb-8">
            <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mathilo-xcicj8vuuphIWaybnjPpCKVvaD3JeF.png"
            alt="Mathilo Logo"
            className="h-12"
            />
        </div>
        <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

