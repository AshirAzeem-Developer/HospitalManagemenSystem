"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  ArrowLeft,
  Search,
  Bell,
  Moon,
  Sparkles,
  ChevronRight,
  ChevronDown,
  UserCog,
  CreditCard,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Clock3,
  FileText,
  CalendarRange,
  Star,
  Home,
  Users,
  Stethoscope,
  Grid2x2,
  UserPlus,
  Receipt,
  HeartPulse,
  Bot,
  LayoutGrid,
  Layers,
  Users2,
  ListOrdered,
  MapPin,
  Briefcase,
  Settings,
  ClipboardList,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  CalendarDays,
  Clock3,
  FileText,
  CalendarRange,
  Star,
  Settings,
  Home,
  Users,
  Stethoscope,
  Receipt,
  HeartPulse,
  Bot,
  LayoutGrid,
  Layers,
  Users2,
  ListOrdered,
  MapPin,
  Briefcase,
  ClipboardList,
};

export type SubMenuItem = {
  label: string;
  href: string;
};

export type MenuItem = {
  label: string;
  href: string;
  icon: keyof typeof iconMap;
  hasArrow?: boolean;
  subItems?: SubMenuItem[];
};

export type MenuGroup = {
  title?: string;
  items: MenuItem[];
};

type MainLayoutProps = {
  children: React.ReactNode;
  menuGroups: MenuGroup[];
  logoSrc?: string;
  userInitials?: string;
  sidebarHeader?: React.ReactNode;
  userName?: string;
  userRole?: string;
  onLogout?: () => Promise<void>;
  profileSettingsHref?: string;
};

export default function MainLayout({
  children,
  menuGroups,
  logoSrc = "/Images/logo.png",
  sidebarHeader,
  userName = "Jimmy Anderson",
  userRole = "Administrator",
  onLogout,
  profileSettingsHref = "/settings/profile",
}: MainLayoutProps) {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [notificationsOn, setNotificationsOn] = useState(true);

  console.log ("main layout");
  return (
    <div className="flex min-h-screen bg-[#F7F8FC]">
      {/* ================= Sidebar ================= */}
      <aside className="w-[276px] bg-white border-r border-[#E5E7EB] flex flex-col">
        {/* Logo */}
        <div className="relative h-[78px] border-b border-[#E5E7EB] flex items-center">
          <div className="flex items-center w-full px-6">
            <Image
              src={logoSrc}
              alt="Hospital Logo"
              width={145}
              height={42}
              className="object-contain"
              priority
            />
          </div>
          <button className="absolute right-5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center hover:bg-[#F7F8FC]">
            <ArrowLeft size={16} className="text-[#667085]" />
          </button>
        </div>

        {/* Clinic Card */}
        {sidebarHeader && <div className="px-4 py-4">{sidebarHeader}</div>}

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4">
          {menuGroups.map((group, idx) => (
            <div key={idx} className={idx === 0 ? "" : "mt-3"}>
              {group.title && (
                <p className="mb-2 px-2 text-[13px] font-medium text-[#98A2B3]">
                  {group.title}
                </p>
              )}

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  const isExpandable = !!item.subItems?.length;
                  const isExpanded = expandedItem === item.label;

                  return (
                    <div key={item.href}>
                      {isExpandable ? (
                        <button
                          onClick={() =>
                            setExpandedItem(isExpanded ? null : item.label)
                          }
                          className={`group w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                            isExpanded ? "bg-[#F5F6FA]" : "hover:bg-[#F5F6FA]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              size={20}
                              className={
                                isExpanded
                                  ? "text-[#2E37A4]"
                                  : "text-[#0A1B39] group-hover:text-[#2E37A4]"
                              }
                            />
                            <span
                              className={`text-[14px] font-medium ${
                                isExpanded
                                  ? "text-[#2E37A4]"
                                  : "text-[#0A1B39] group-hover:text-[#2E37A4]"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown size={18} className="text-[#2E37A4]" />
                          ) : (
                            <ChevronRight
                              size={18}
                              className="text-[#0A1B39] group-hover:text-[#2E37A4]"
                            />
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#F5F6FA]"
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              size={20}
                              className="text-[#0A1B39] group-hover:text-[#2E37A4]"
                            />
                            <span className="text-[14px] font-medium text-[#0A1B39] group-hover:text-[#2E37A4]">
                              {item.label}
                            </span>
                          </div>
                          {item.hasArrow && (
                            <ChevronRight
                              size={18}
                              className="text-[#0A1B39] group-hover:text-[#2E37A4]"
                            />
                          )}
                        </Link>
                      )}

                      {/* Sub items with colored dot on active */}
                      {isExpandable && isExpanded && (
                        <div className="mt-1 ml-6 space-y-1 border-l border-gray-200 pl-4">
                          {item.subItems!.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50"
                              >
                                <span
                                  className={`h-2 w-2 rounded-full shrink-0 ${
                                    isSubActive
                                      ? "bg-[#2E37A4]"
                                      : "border border-gray-300 bg-white"
                                  }`}
                                />
                                <span
                                  className="text-[14px] font-medium"
                                  style={{
                                    color: isSubActive ? "#2E37A4" : "#9DA4B0",
                                  }}
                                >
                                  {sub.label}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* ================= Header ================= */}
        <header className="relative h-[78px] border-b border-[#E5E7EB] bg-white flex items-center justify-between px-8">
          {/* Search */}
          <div className="flex items-center">
            <div className="flex items-center w-[300px] h-10 rounded-lg border border-[#E5E7EB] bg-white px-3">
              <Search size={16} className="text-[#98A2B3]" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2 flex-1 bg-transparent outline-none text-sm placeholder:text-[#98A2B3]"
              />
              <span className="text-xs text-[#98A2B3]">⌘</span>
            </div>
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

            {/* ================= Profile ================= */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative flex items-center justify-center"
              >
                <Image
                  src="/Images/admin.png"
                  alt="Admin"
                  width={42}
                  height={42}
                  className="rounded-full object-cover border border-[#E5E7EB]"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-14 w-[270px] rounded-xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden z-50">
                  {/* User info card */}
                  <div className="flex items-center gap-3 px-5 py-4 bg-[#F7F8FC]">
                    <Image
                      src="/Images/admin.png"
                      alt="Admin"
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-[#E5E7EB]"
                    />
                    <div>
                    <p className="text-sm font-semibold text-[#0A1B39]">
  {userName}
</p>
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

               {onLogout ? (
  <form action={onLogout}>
    <button
      type="submit"
      className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50"
    >
      <LogOut size={18} />
      <span>Log Out</span>
    </button>
  </form>
) : (
  <button className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50">
    <LogOut size={18} />
    <span>Log Out</span>
  </button>
)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= Main ================= */}
        <main className="flex-1 bg-[#F7F8FC] p-8">{children}</main>

        {/* ================= Footer ================= */}
        <footer className="border-t border-[#E5E7EB] bg-white px-8 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hospital Management System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}