import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/feed", "/admin", "/profile", "/shopping-list"];

// Routes that are only for admins
const ADMIN_ROUTES = ["/admin"];

// Routes that should redirect authenticated users
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get("access_token")?.value;

  // Get user data from cookies
  const userDataCookie = request.cookies.get("user_data")?.value;
  let isAdmin = false;

  if (userDataCookie) {
    try {
      const userData = JSON.parse(userDataCookie);
      isAdmin = userData.isAdmin || false;
    } catch {
      // Invalid user data, treat as not authenticated
    }
  }

  const isAuthenticated = !!token;

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is admin-only
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // Check if route is for non-authenticated users
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect non-admin users from admin routes
  if (isAdminRoute && (!isAuthenticated || !isAdmin)) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
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
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
