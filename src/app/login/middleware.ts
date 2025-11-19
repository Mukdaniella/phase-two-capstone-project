// middleware.ts
import { auth } from "../lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth

  const protectedPaths = ["/profile", "/account", "/create-post"] // add more later

  const isProtected = protectedPaths.some((path) =>
    nextUrl.pathname.startsWithParams.startsWith(path)
  )

  if (isProtected && !session?.user) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set("callbackUrl", nextUrl.toString())
    return NextResponse.redirect(loginUrl)
  }

  // Optional: redirect logged-in users away from login/signup
  if (session?.user && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }
})

export const config = {
  matcher: [
    "/profile/:path*",
    "/account/:path*",
    "/create-post/:path*",
    "/login",
    "/signup",
  ],
}