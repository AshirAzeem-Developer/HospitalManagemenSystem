import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { adminLinks, doctorLinks, patientLinks } from "@/components/layout/nav-links";
import SettingsPanel from "@/components/settings/SettingsPanel";

export default async function SettingsLayout({
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

  const links =
    role === "admin" ? adminLinks : role === "doctor" ? doctorLinks : patientLinks;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F7F8FC] dark:bg-[#091326] max-w-full overflow-x-hidden">
      <Sidebar links={links} />
      
      <div className="flex flex-1 flex-col pt-[64px] md:pt-0 min-w-0 max-w-full">
        <Navbar profileSettingsHref="/settings/profile" />
      
        <main className="flex-1 p-4 md:p-8 bg-[#F7F8FC] dark:bg-[#091326] w-full max-w-full overflow-x-hidden [&_form]:max-w-full [&_input]:max-w-full [&_select]:max-w-full">
          <SettingsPanel baseHref="/settings" showOtherCategories={role === "admin"}>
            <div className="w-full max-w-full overflow-hidden">
              {children}
            </div>
          </SettingsPanel>
        </main>
        
        <footer className="border-t border-[#E5E7EB] dark:border-[#2A3850] bg-white dark:bg-[#0A162A] px-4 md:px-8 py-4 text-center text-sm text-gray-500 dark:text-[#94A3B8]">
          © {new Date().getFullYear()} SafeHeal. All rights reserved.
        </footer>
      </div>
    </div>
  );
}