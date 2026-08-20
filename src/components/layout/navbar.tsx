import Link from "next/link";
import { Search, Settings } from "lucide-react";
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
    <header className="relative flex h-[78px] items-center justify-between gap-2 border-b border-[#E5E7EB] bg-white px-3 dark:border-[#2A3850] dark:bg-[#0A162A] sm:px-4 md:px-8 no-print">
      {/* Right Side */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
        <Link
          href={profileSettingsHref}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] text-[#0A1B39] hover:bg-[#F7F8FC] dark:border-[#3A4A63] dark:text-[#CBD5E1] dark:hover:bg-[#18243A] sm:h-10 sm:w-10"
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
