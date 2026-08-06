"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
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
  logoSrc = "/Images/logo.png",
  sidebarHeader,
}: {
  links: MenuGroup[];
  roleLabel?: string;
  logoSrc?: string;
  sidebarHeader?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
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

      {sidebarHeader && <div className="px-4 py-4">{sidebarHeader}</div>}

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4">
        {links.map((group, idx) => (
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
  );
}