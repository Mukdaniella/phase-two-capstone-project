import { auth } from "../../../lib/auth"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isProtectedRoute = nextUrl.pathname.startsWith("/profile") || nextUrl.pathname.startsWith("/dashboard")

  if (isProtectedRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", nextUrl))
    }
  }

  // Optional: Redirect logged-in users from login/signup
  if (req.auth && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
    return Response.redirect(new URL("/", nextUrl))
  }
})

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/login", "/signup"],
}