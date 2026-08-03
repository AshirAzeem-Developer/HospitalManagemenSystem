export type UserRole = "admin" | "doctor" | "patient";

// Maps a route prefix to the roles allowed to access it.
// A route not listed here (e.g. /settings) is open to any logged-in user.
export const roleRoutes: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/doctor", roles: ["doctor"] },
  { prefix: "/patient", roles: ["patient"] },
];

export function getAllowedRoles(pathname: string): UserRole[] | null {
  const match = roleRoutes.find((r) => pathname.startsWith(r.prefix));
  return match ? match.roles : null;
}

// Routes reachable without being logged in.
export const publicRoutes = ["/login", "/register", "/unauthorized"];
