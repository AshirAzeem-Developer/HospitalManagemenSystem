"use client";
 
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { UserCog, LogOut } from "lucide-react";
 
export function ProfileMenu({
  userName,
  userRole,
  avatarUrl,
  onLogout,
  profileSettingsHref = "/settings/profile",
}: {
  userName: string;
  userRole: string;
  avatarUrl?: string | null;
  onLogout: () => Promise<void>;
  profileSettingsHref?: string;
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
 
  const initial = userName?.charAt(0).toUpperCase() || "U";
 
  return (
    <div className="relative">
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="relative flex items-center justify-center"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={userName}
            width={42}
            height={42}
            className="rounded-full object-cover border border-[#E5E7EB] dark:border-[#3A4A63]"
          />
        ) : (
          <div className="h-[42px] w-[42px] rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-sm font-semibold border border-[#E5E7EB] dark:border-[#3A4A63]">
            {initial}
          </div>
        )}
 
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#0A162A]"></span>
      </button>
 
      {showProfileMenu && (
        <div className="absolute right-0 top-14 w-[270px] rounded-xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden z-50 dark:border-[#2A3850] dark:bg-[#111D2E]">
         
          {/* Profile Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-[#F7F8FC] dark:bg-[#18243A]">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={userName}
                width={40}
                height={40}
                className="rounded-full object-cover border border-[#E5E7EB] dark:border-[#3A4A63]"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-sm font-semibold border border-[#E5E7EB] dark:border-[#3A4A63]">
                {initial}
              </div>
            )}
 
            <div>
              <p className="text-sm font-semibold text-[#0A1B39] dark:text-white">
                {userName}
              </p>
 
              <p className="text-xs text-[#98A2B3] dark:text-[#94A3B8]">
                {userRole}
              </p>
            </div>
          </div>
 
          {/* Menu */}
          <div className="py-2">
            <Link
              href={profileSettingsHref}
              className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-[#344054] hover:bg-[#F7F8FC] dark:text-[#CBD5E1] dark:hover:bg-[#18243A]"
              onClick={() => setShowProfileMenu(false)}
            >
              <UserCog size={18} />
              <span>Profile Settings</span>
            </Link>
          </div>
 
          {/* Divider */}
          <div className="border-t border-[#E5E7EB] dark:border-[#2A3850]" />
 
          {/* Logout */}
          <form action={onLogout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}