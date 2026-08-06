import { Search, Grid2x2, UserPlus, Moon, Bell, Sparkles } from "lucide-react";
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
        .select("full_name, role")
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
        <Search size={16} className="text-[#98A2B3]" />
        <input
          type="text"
          placeholder="Search"
          className="ml-2 flex-1 bg-transparent outline-none text-sm placeholder:text-[#98A2B3]"
        />
        <span className="text-xs text-[#98A2B3]">⌘</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-medium text-white">
          <Sparkles size={16} />
          AI Assistance
        </button>

        <button className="h-10 w-10 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F7F8FC]">
          <Grid2x2 size={18} />
        </button>

        <button className="h-10 w-10 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F7F8FC]">
          <UserPlus size={18} />
        </button>

        <button className="h-10 w-10 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F7F8FC]">
          <Moon size={18} />
        </button>

        <button className="relative h-10 w-10 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F7F8FC]">
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500"></span>
        </button>

        <ProfileMenu
          userName={displayName}
          userRole={roleLabel}
          onLogout={logoutAction}
          profileSettingsHref={profileSettingsHref}
        />
      </div>
    </header>
  );
}