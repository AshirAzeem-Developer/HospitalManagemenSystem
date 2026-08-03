import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { getAllowedRoles, publicRoutes } from "@/config/route";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // Determine user role if user is logged in
  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    userRole = profile?.role || user.user_metadata?.role || "patient";
  }

  // If user is already logged in and visits auth pages (/login, /register) or root (/), redirect to dashboard
  if (user && userRole) {
    if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return NextResponse.redirect(new URL(`/${userRole}`, request.url));
    }
  }

  // Public routes are reachable without logging in.
  if (publicRoutes.some((route: string) => pathname.startsWith(route))) {
    return supabaseResponse;
  }

  // Not logged in -> send to login.
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const allowedRoles = getAllowedRoles(pathname);

  // Route isn't role-restricted (e.g. /settings) - any logged-in user passes.
  if (!allowedRoles) {
    return supabaseResponse;
  }

  // Check if user's role is permitted on this route
  if (!userRole || !allowedRoles.includes(userRole as any)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
