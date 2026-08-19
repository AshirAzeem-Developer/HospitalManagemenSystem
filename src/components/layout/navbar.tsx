import Link from "next/link";
import { Settings } from "lucide-react"; // 🟢 Search icon ka import nikal diya
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/features/auth/actions";
import { ProfileMenu } from "./profile-menu";
import { ThemeToggle } from "./ThemeToggle";

export async function Navbar({
  profileSettingsHref = "/settings/profile",
}: {
  profileSettingsHref?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name, role, avatar_url")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    "User";

  const roleLabel = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "User";

  return (
    <header className="relative h-[78px] border-b border-[#E5E7EB] dark:border-[#2A3850] bg-white dark:bg-[#0A162A] flex items-center justify-between px-3 sm:px-4 md:px-8 gap-2">
      
      {/* 🟢 Search Box yahan se remove ho gaya hai */}

      {/* Right Side Icons automatic right par hi rahenge kyunki main container flexbox hai */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 ml-auto shrink-0">
        <Link
          href={profileSettingsHref}
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-[#E5E7EB] dark:border-[#3A4A63] flex items-center justify-center hover:bg-[#F7F8FC] dark:hover:bg-[#18243A] text-[#0A1B39] dark:text-[#CBD5E1]"
        >
          <Settings size={18} />
        </Link>

        <ThemeToggle />

        <ProfileMenu
          userName={displayName}
          userRole={roleLabel}
          avatarUrl={profile?.avatar_url ?? null}
          onLogout={logoutAction}
          profileSettingsHref={profileSettingsHref}
        />
      </div>
    </header>
  );
}
