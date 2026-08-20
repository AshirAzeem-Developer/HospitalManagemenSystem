"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  CalendarDays,
  Clock3,
  FileText,
  CalendarRange,
  Star,
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
  Settings,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import type { MenuGroup } from "./nav-links";

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

export function Sidebar({
  links,
  sidebarHeader,
}: {
  links: MenuGroup[];
  roleLabel?: string;
  sidebarHeader?: React.ReactNode;
}) {
  const pathname = usePathname();

  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkTheme = () => {
      setIsDark(
        document.documentElement.classList.contains("dark")
      );
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const currentLogo = isDark
    ? "/Images/DarkTheme.png"
    : "/Images/LogoLightTheme.png";

  return (
    <>
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between bg-white dark:bg-[#0A162A] w-full h-[64px] px-4 border-b border-[#E5E7EB] dark:border-[#2A3850] fixed top-0 left-0 z-40">
        <div className="relative w-[120px] h-[40px]">
          {mounted && (
            <Image
              key={currentLogo}
              src={currentLogo}
              alt="Hospital Logo"
              fill
              sizes="120px"
              className="object-contain object-left"
              priority
            />
          )}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl border border-[#E5E7EB] dark:border-[#3A4A63] bg-white dark:bg-[#152035] hover:bg-[#F7F8FC] dark:hover:bg-[#18243A]"
        >
          <Menu
            size={20}
            className="text-[#0A1B39] dark:text-[#F8FAFC]"
          />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-[#0A162A] border-r border-[#E5E7EB] dark:border-[#2A3850] flex flex-col fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out
          md:relative md:transform-none md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-[88px]" : "md:w-[276px]"}
          w-[276px]`}
      >
        {/* Logo Header */}
        <div className="relative h-[78px] border-b border-[#E5E7EB] dark:border-[#2A3850] flex items-center px-6 overflow-hidden">
          {!isCollapsed && (
            <div className="relative w-[200px] h-[100px] -mb-1">
              {mounted && (
                <Image
                  key={currentLogo}
                  src={currentLogo}
                  alt="Hospital Logo"
                  fill
                  sizes="200px"
                  className="object-contain object-center"
                  priority
                />
              )}
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute right-5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-[#E5E7EB] dark:border-[#3A4A63] bg-white dark:bg-[#152035] flex items-center justify-center hover:bg-[#F7F8FC] dark:hover:bg-[#18243A] z-10"
          >
            <X
              size={16}
              className="text-[#667085] dark:text-[#CBD5E1]"
            />
          </button>

        
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex absolute top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-[#E5E7EB] dark:border-[#3A4A63] bg-white dark:bg-[#152035] items-center justify-center hover:bg-[#F7F8FC] dark:hover:bg-[#18243A] z-10 ${
              isCollapsed
                ? "right-1/2 translate-x-1/2"
                : "right-5"
            }`}
          >
            {isCollapsed ? (
              <ArrowRight
                size={16}
                className="text-[#667085] dark:text-[#CBD5E1]"
              />
            ) : (
              <ArrowLeft
                size={16}
                className="text-[#667085] dark:text-[#CBD5E1]"
              />
            )}
          </button>
        </div>

        {/* Sidebar Header */}
        {sidebarHeader && (
          <div className="px-4 py-4">
            {sidebarHeader}
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 mt-2">
          {links.map((group, idx) => (
            <div
              key={idx}
              className={idx === 0 ? "" : "mt-3"}
            >
              {group.title && (
                <p className="mb-2 px-2 text-[13px] font-medium text-[#98A2B3] dark:text-[#94A3B8]">
                  {group.title}
                </p>
              )}

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon =
                    iconMap[item.icon as keyof typeof iconMap];

                  const isActive =
                    item.href === "/admin" ||
                    item.href === "/doctor" ||
                    item.href === "/patient" ||
  item.href === "/patient/appointments"
                      ? pathname === item.href
                      : pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                  const isExpandable =
                    !!item.subItems?.length;

                  const isExpanded =
                    expandedItem === item.label;

                  return (
                    <div key={item.href}>
                      {/* Expandable Item */}
                      {isExpandable ? (
                        <button
                          onClick={() =>
                            setExpandedItem(
                              isExpanded
                                ? null
                                : item.label
                            )
                          }
                          className={`group w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                            isExpanded
                              ? "bg-[#F5F6FA] dark:bg-[#211E46]"
                              : "hover:bg-[#F5F6FA] dark:hover:bg-[#18243A]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              size={20}
                              className={
                                isExpanded
                                  ? "text-[#2E37A4] dark:text-[#A78BFA]"
                                  : "text-[#0A1B39] dark:text-[#CBD5E1] group-hover:text-[#2E37A4] dark:group-hover:text-white"
                              }
                            />

                            <span
                              className={`text-[14px] font-medium ${
                                isCollapsed
                                  ? "md:hidden"
                                  : ""
                              } ${
                                isExpanded
                                  ? "text-[#2E37A4] dark:text-white"
                                  : "text-[#0A1B39] dark:text-[#CBD5E1] group-hover:text-[#2E37A4] dark:group-hover:text-white"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>

                          {isExpanded ? (
                            <ChevronDown
                              size={18}
                              className="text-[#2E37A4] dark:text-[#A78BFA]"
                            />
                          ) : (
                            <ChevronRight
                              size={18}
                              className="text-[#0A1B39] dark:text-[#CBD5E1] group-hover:text-[#2E37A4] dark:group-hover:text-white"
                            />
                          )}
                        </button>
                      ) : (
                        /* Normal Link */
                        <Link
                          href={item.href}
                          onClick={() =>
                            setIsOpen(false)
                          }
                          className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                            isActive
                              ? "bg-[#F5F6FA] dark:bg-[#211E46]"
                              : "hover:bg-[#F5F6FA] dark:hover:bg-[#18243A]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              size={20}
                              className={
                                isActive
                                  ? "text-[#2E37A4] dark:text-[#A78BFA]"
                                  : "text-[#0A1B39] dark:text-[#CBD5E1] group-hover:text-[#2E37A4] dark:group-hover:text-white"
                              }
                            />

                            <span
                              className={`text-[14px] font-medium ${
                                isCollapsed
                                  ? "md:hidden"
                                  : ""
                              } ${
                                isActive
                                  ? "text-[#2E37A4] dark:text-white"
                                  : "text-[#0A1B39] dark:text-[#CBD5E1] group-hover:text-[#2E37A4] dark:group-hover:text-white"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>

                          {item.hasArrow && (
                            <ChevronRight
                              size={18}
                              className="text-[#0A1B39] dark:text-[#CBD5E1] group-hover:text-[#2E37A4] dark:group-hover:text-white"
                            />
                          )}
                        </Link>
                      )}

                      {/* Sub Items */}
                      {isExpandable && isExpanded && (
                        <div className="mt-1 ml-6 space-y-1 border-l border-gray-200 dark:border-[#2A3850] pl-4">
                          {item.subItems!.map((sub) => {
                            const isSubActive =
                              pathname === sub.href;

                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() =>
                                  setIsOpen(false)
                                }
                                className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#18243A]"
                              >
                                <span
                                  className={`h-2 w-2 rounded-full shrink-0 ${
                                    isSubActive
                                      ? "bg-[#2E37A4] dark:bg-[#8B5CF6]"
                                      : "border border-gray-300 dark:border-[#3A4A63] bg-white dark:bg-transparent"
                                  }`}
                                />

                                <span
                                  className="text-[14px] font-medium"
                                  style={{
                                    color: isSubActive
                                      ? "#2E37A4"
                                      : "#9DA4B0",
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
    </>
  );
}
