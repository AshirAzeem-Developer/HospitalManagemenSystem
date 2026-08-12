import Link from "next/link";
import { Search, Moon, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/features/auth/actions";
import { ProfileMenu } from "./profile-menu";

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
<header className="relative h-[78px] border-b border-[#E5E7EB] dark:border-[#2A3850] bg-white dark:bg-[#0A162A] flex items-center justify-between px-4 md:px-8 gap-2">  {/* Search */}
<div className="hidden sm:flex items-center w-full max-w-[300px] h-10 rounded-lg border border-[#E5E7EB] dark:border-[#3A4A63] bg-white dark:bg-[#121C31] px-3">
  <Search size={16} className="text-[#9DA4B0] dark:text-[#94A3B8]" />
  <input
    type="text"
    placeholder="Search"
    className="ml-2 flex-1 bg-transparent outline-none text-sm text-[#0A1B39] dark:text-[#F8FAFC] placeholder:text-[#9DA4B0] dark:placeholder:text-[#94A3B8]"
  />
  <span className="text-xs text-black dark:text-[#CBD5E1]">⌘</span>
</div>

  <div className="flex items-center gap-2 md:gap-3 ml-auto">
    

    <Link
  href={profileSettingsHref}
  className="h-10 w-10 rounded-full border border-[#E5E7EB] dark:border-[#3A4A63] flex items-center justify-center hover:bg-[#F7F8FC] dark:hover:bg-[#18243A] text-[#0A1B39] dark:text-[#CBD5E1]"
>
  <Settings size={18} />
</Link>

<button className="h-10 w-10 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F7F8FC]">
  <Moon size={18} />
</button>

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