import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware will run on all routes
export function middleware(request: NextRequest) {
  // Allow all routes to be navigated to without redirection
  return NextResponse.next();
}

// Specify which routes this middleware applies to
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
