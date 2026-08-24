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

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role || user.user_metadata?.role || "patient";

  if (role !== "patient") {
    redirect("/unauthorized");
  }

  return (
<<<<<<< Updated upstream
    <div className="flex">
      <div className="print:hidden">
        <Sidebar links={patientLinks} roleLabel="Patient" />
      </div>

      <div className="flex-1">
        <div className="print:hidden">
          <Navbar />
        </div>

        <main className="p-4 sm:p-6 print:min-h-0 print:bg-white print:p-0">
          {children}
        </main>

        <main className="p-6">{children}</main>
=======
    <div
      className="
        min-h-screen
        w-full
        min-w-0
        overflow-x-hidden
        bg-[#F7F8FC]
        dark:bg-[#091326]
      "
    >
      {/* SIDEBAR */}
      <div
        className="
          fixed
          left-0
          top-0
          z-40
          hidden
          h-screen
          w-64
          md:block
        "
      >
        <Sidebar links={patientLinks} roleLabel="Patient" />
      </div>

      {/* MAIN APPLICATION AREA */}
      <div
        className="
          min-h-screen
          min-w-0
          w-full
          overflow-x-hidden
          md:ml-64
          md:w-[calc(100%-16rem)]
        "
      >
        {/* NAVBAR */}
        <Navbar profileSettingsHref="/settings/profile" />

        {/* PAGE CONTENT */}
        <main
          className="
            min-w-0
            overflow-x-hidden
            bg-[#F7F8FC]
            p-4
            dark:bg-gray-950
            sm:p-6
            md:p-8
          "
        >
          <div className="w-full min-w-0 max-w-full">{children}</div>
        </main>

        {/* FOOTER */}
        <footer
          className="
            w-full
            min-w-0
            border-t
            border-[#E5E7EB]
            bg-white
            px-4
            py-4
            text-center
            text-sm
            text-gray-500
            dark:border-[#2A3850]
            dark:bg-[#0A162A]
            dark:text-[#94A3B8]
            md:px-8
          "
        >
          © {new Date().getFullYear()} SafeHeal. All rights reserved.
        </footer>
>>>>>>> Stashed changes
      </div>
    </div>
  );
}
