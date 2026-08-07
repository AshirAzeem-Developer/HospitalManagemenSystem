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

  const appointmentsHref =
    role === "admin"
      ? "/admin/appointments"
      : role === "doctor"
      ? "/doctor/appointments"
      : "/patient/appointments";

 return (
    <div className="flex min-h-screen bg-[#F7F8FC]">
      <Sidebar links={links} />
      <div className="flex flex-1 flex-col">
        <Navbar
          profileSettingsHref="/settings/profile"
          appointmentsHref={appointmentsHref}
        />
        <main className="flex-1 p-8 bg-[#F7F8FC]">
          <SettingsPanel baseHref="/settings" showOtherCategories={role === "admin"}>
            {children}
          </SettingsPanel>
        </main>
        <footer className="border-t border-[#E5E7EB] bg-white px-8 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hospital Management System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}