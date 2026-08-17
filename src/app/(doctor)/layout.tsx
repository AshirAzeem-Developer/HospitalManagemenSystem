import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { doctorLinks } from "@/components/layout/nav-links";

export default async function DoctorLayout({
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
  if (role !== "doctor") redirect("/unauthorized");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F7F8FC] dark:bg-[#091326]">
      <Sidebar links={doctorLinks} />

      <div className="flex flex-1 flex-col pt-[64px] md:pt-0">
        <Navbar profileSettingsHref="/settings/profile" />
        <main className="flex-1 bg-[#F7F8FC] dark:bg-[#091326] p-4 md:p-8">
          {children}
        </main>
        <footer className="border-t border-[#E5E7EB] dark:border-[#2A3850] bg-white dark:bg-[#0A162A] px-4 md:px-8 py-4 text-center text-sm text-gray-500 dark:text-[#94A3B8]">
          © {new Date().getFullYear()} SafeHeal. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
