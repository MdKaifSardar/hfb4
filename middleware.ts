import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = ["/professor/dashboard", "/user/feed", "/pdf"]

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Mock authentication check
  // In a real app, this would check for a valid session
  const isAuthenticated = checkAuth(request)

  // If the route is protected and the user is not authenticated,
  // redirect to the sign-in page
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

// Mock function to check authentication
function checkAuth(request: NextRequest): boolean {
  // In a real app, this would check for a valid session cookie
  // For demo purposes, we'll assume the user is authenticated
  return true
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/professor/:path*", "/user/:path*", "/pdf/:path*"],
}
