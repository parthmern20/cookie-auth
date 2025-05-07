import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    // Check for the auth token cookie set by your Node.js API
    const authToken = request.cookies.get("auth_token")?.value
    const userRole = request.cookies.get("user_role")?.value

    // If trying to access protected routes without auth
    if (!authToken && !request.nextUrl.pathname.startsWith("/login") && !request.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If trying to access admin routes but not an admin
    if (request.nextUrl.pathname.startsWith("/admin") && userRole !== "admin") {
      if (userRole === "recruiter") {
        return NextResponse.redirect(new URL("/recruiter", request.url))
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If trying to access recruiter routes but not a recruiter
    if (request.nextUrl.pathname.startsWith("/recruiter") && userRole !== "recruiter") {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If authenticated and trying to access login page
    if (authToken && request.nextUrl.pathname === "/login") {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      } else if (userRole === "recruiter") {
        return NextResponse.redirect(new URL("/recruiter", request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Error in middleware:", error)
    // In case of error, allow the request to proceed
    // The server-side or client-side auth checks will handle it
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
