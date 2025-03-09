import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === "/auth/login" || 
    path === "/auth/register" || 
    path === "/auth/forgot-password" ||
    path === "/admin/login";
  
  // Get the token from cookies
  const token = request.cookies.get("token")?.value;
  
  // Check if the path is for admin routes
  const isAdminPath = path.startsWith("/admin") && path !== "/admin/login";
  
  // If trying to access admin routes
  if (isAdminPath) {
    // If no token, redirect to admin login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // For now, we'll just check if token exists for admin routes
    // In a real app, you would validate the token and check the user role
    // This simplification will allow navigation to the dashboard after login
    return NextResponse.next();
  }
  
  // If user is already logged in and tries to access login page
  if (isPublicPath && token) {
    // For admin login specifically, we'll just let them through
    // In a real app, you'd check if they're already an admin
    if (path === "/admin/login") {
      return NextResponse.next();
    }
    
    // For other public paths, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // If user is not logged in and tries to access protected route
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all routes except static files, api routes, and _next
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
