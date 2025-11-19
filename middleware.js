import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/onboarding',
    '/welcome',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/passcode'
  ]

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  // For protected routes, let AuthGuard handle the logic
  // Middleware just ensures proper headers
  if (isProtectedRoute) {
    const response = NextResponse.next()
    response.headers.set('x-middleware-cache', 'no-cache')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}