import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { adminLinks } from "@/components/layout/nav-links";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role || user.user_metadata?.role || "patient";

  if (role !== "admin") redirect("/unauthorized");

  return (
    <div className="flex min-h-screen">
      <Sidebar links={adminLinks} roleLabel="Admin" />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="flex-1 bg-background p-8">{children}</main>

        <footer className="border-t border-border bg-background px-8 py-4 text-center text-sm text-muted">
          © {new Date().getFullYear()} Hospital Management System. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
}
