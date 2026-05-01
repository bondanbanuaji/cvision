import { NextRequest, NextResponse } from "next/server"

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard"]

// Routes that should NOT be accessible when logged in
const AUTH_ROUTES = ["/login", "/register"]

// The landing page — redirect to dashboard if logged in
const PUBLIC_HOME = "/"

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // NextAuth.js v5 stores session as a JWT cookie
  // In dev it's "authjs.session-token", in production with HTTPS it's "__Secure-authjs.session-token"
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value

  const isAuthenticated = !!sessionToken

  // 1. Protected routes: redirect unauthenticated users to /login
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Auth routes (login/register): redirect authenticated users to /dashboard
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // 3. Landing page: redirect authenticated users to /dashboard
  if (pathname === PUBLIC_HOME && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.ico$).*)",
  ],
}
