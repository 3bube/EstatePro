import { NextRequest, NextResponse } from "next/server";

export function withAdminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async function middleware(req: NextRequest) {
    // Get the token from cookies or headers
    const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      // Get user from session/local storage
      // In a real implementation, you would validate the token on the server
      // For client-side protection, we'll check if user data exists and has admin role
      const user = getUserFromClientStorage();
      
      if (!user || user.role !== "admin") {
        // Redirect to login if not admin
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      // Continue to the protected route
      return handler(req);
    } catch (error) {
      console.error("Admin auth error:", error);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  };
}

// Helper function to get user from client storage
// This is a placeholder - in a real app, you'd implement proper token validation
function getUserFromClientStorage() {
  // This function would be implemented on the client side
  // For middleware, we'd use a different approach with proper JWT validation
  return null;
}
