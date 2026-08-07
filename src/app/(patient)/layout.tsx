import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { patientLinks } from "@/components/layout/nav-links";

export default async function PatientLayout({
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
  if (role !== "patient") redirect("/unauthorized");

  return (
    <div className="flex min-h-screen bg-[#F7F8FC]">
      <Sidebar links={patientLinks} />

      <div className="flex flex-1 flex-col">
        <Navbar profileSettingsHref="/settings/profile" 
        appointmentsHref="/patient/appointments"
        />
        <main className="flex-1 bg-[#F7F8FC] p-8">{children}</main>
        <footer className="border-t border-[#E5E7EB] bg-white px-8 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hospital Management System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}