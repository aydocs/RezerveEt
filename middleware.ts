import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import appConfig from "./lib/config"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // CORS headers for API routes
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: response.headers })
    }

    return response
  }

  // Maintenance mode check
  if (appConfig.features.maintenanceMode && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    const authToken = request.cookies.get("auth-token")?.value

    if (!authToken) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }
  }

  // Business dashboard protection
  if (pathname.startsWith("/dashboard/business")) {
    const authToken = request.cookies.get("auth-token")?.value

    if (!authToken) {
      return NextResponse.redirect(new URL("/login?redirect=/dashboard/business", request.url))
    }
  }

  // User dashboard protection
  if (pathname.startsWith("/dashboard/user")) {
    const authToken = request.cookies.get("auth-token")?.value

    if (!authToken) {
      return NextResponse.redirect(new URL("/login?redirect=/dashboard/user", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/dashboard/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
