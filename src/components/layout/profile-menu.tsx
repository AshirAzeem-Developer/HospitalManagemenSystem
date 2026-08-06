"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  UserCog,
  Settings,
  Bell,
  CreditCard,
  LogOut,
} from "lucide-react";

export function ProfileMenu({
  userName,
  userRole,
  onLogout,
  profileSettingsHref = "/settings/profile",
}: {
  userName: string;
  userRole: string;
  onLogout: () => Promise<void>;
  profileSettingsHref?: string;
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);

  return (
    <div className="relative">
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="relative flex items-center justify-center"
      >
        <Image
          src="/Images/admin.png"
          alt="User"
          width={42}
          height={42}
          className="rounded-full object-cover border border-[#E5E7EB]"
        />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
      </button>

      {showProfileMenu && (
        <div className="absolute right-0 top-14 w-[270px] rounded-xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden z-50">
          <div className="flex items-center gap-3 px-5 py-4 bg-[#F7F8FC]">
            <Image
              src="/Images/admin.png"
              alt="User"
              width={40}
              height={40}
              className="rounded-full object-cover border border-[#E5E7EB]"
            />
            <div>
              <p className="text-sm font-semibold text-[#0A1B39]">{userName}</p>
              <p className="text-xs text-[#98A2B3]">{userRole}</p>
            </div>
          </div>

          <div className="py-2">
            <Link
              href={profileSettingsHref}
              className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-[#344054] hover:bg-[#F7F8FC]"
              onClick={() => setShowProfileMenu(false)}
            >
              <UserCog size={18} />
              <span>Profile Settings</span>
            </Link>

            <button className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-[#344054] hover:bg-[#F7F8FC]">
              <Settings size={18} />
              <span>Account Settings</span>
            </button>

            <div className="flex w-full items-center justify-between px-5 py-2.5 text-sm text-[#344054]">
              <div className="flex items-center gap-3">
                <Bell size={18} />
                <span>Notifications</span>
              </div>
              <button
                onClick={() => setNotificationsOn(!notificationsOn)}
                className={`h-6 w-11 shrink-0 rounded-full transition-colors relative border ${
                  notificationsOn
                    ? "bg-[#4F46E5] border-[#4F46E5]"
                    : "bg-white border-[#D0D5DD]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4.5 w-4.5 rounded-full transition-transform duration-200 ${
                    notificationsOn
                      ? "bg-white translate-x-[22px]"
                      : "bg-[#98A2B3] translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <button className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-[#344054] hover:bg-[#F7F8FC]">
              <CreditCard size={18} />
              <span>Transactions</span>
            </button>
          </div>

          <div className="border-t border-[#E5E7EB]" />

          <form action={onLogout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50"
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