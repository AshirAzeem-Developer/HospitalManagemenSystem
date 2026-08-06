import { redirect } from "next/navigation";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";
import { adminLinks } from "@/components/layout/nav-links";
import MainLayout from "@/components/ui/MainLayout";
import { logoutAction } from "@/features/auth/actions";

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
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const role =
    profile?.role ||
    user.user_metadata?.role ||
    "patient";

  if (role !== "admin") {
    redirect("/unauthorized");
  }

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email ||
    "User";

  const clinicHeader = (
    <div className="mb-4">
      <Image
        src="/Images/ClinicSelect.png"
        alt="Trustcare Clinic"
        width={244}
        height={56}
        className="w-full h-auto rounded-xl"
        priority
      />
    </div>
  );

  return (
    <MainLayout
      menuGroups={adminLinks}
      userInitials="AD"
      sidebarHeader={clinicHeader}
      userName={displayName}
      userRole="Administrator"
      onLogout={logoutAction}
      profileSettingsHref="/admin/settings/profile"
    >
      {children}
    </MainLayout>
  );
}