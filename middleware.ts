import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase_server"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const res = NextResponse.next()
  const supabase = await createClient()

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public paths that don't require authentication
  const publicPaths = ["/zaloguj", "/zarejestruj", "/przypomnij-haslo", "/resetuj-haslo", "/"]
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path),
  )

  // Redirect authenticated users away from auth pages
  if (session && isPublicPath && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect unauthenticated users to login page
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/zaloguj", request.url))
  }

  return res
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/auth (auth API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
  ],
}

