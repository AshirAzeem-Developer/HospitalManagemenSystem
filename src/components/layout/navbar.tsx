import Link from "next/link";
import { Search, Grid2x2, Moon, Settings, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/features/auth/actions";
import { ProfileMenu } from "./profile-menu";

export async function Navbar({
  profileSettingsHref = "/settings/profile",
  appointmentsHref,
}: {
  profileSettingsHref?: string;
  appointmentsHref: string;
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
    <header className="relative h-[78px] border-b border-[#E5E7EB] bg-white flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex items-center w-[300px] h-10 rounded-lg border border-[#E5E7EB] bg-white px-3">
        <Search size={16} className="text-[#9DA4B0]" />
        <input
          type="text"
          placeholder="Search"
          className="ml-2 flex-1 bg-transparent outline-none text-sm placeholder:text-[#9DA4B0]"
        />
        <span className="text-xs text-black">⌘</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-medium text-white">
          <Sparkles size={16} />
          AI Assistance
        </button>

        <Link
          href={appointmentsHref}
          className="h-10 w-10 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F7F8FC]"
        >
          <Grid2x2 size={18} />
        </Link>

        <Link
          href={profileSettingsHref}
          className="h-10 w-10 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F7F8FC]"
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