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
    <div className="flex">
      <Sidebar links={doctorLinks} roleLabel="Doctor" />
      <div className="flex-1">
        <Navbar />
        <main className="p-6 bg-slate-300 ">{children}</main>
      </div>
    </div>
  );
}
