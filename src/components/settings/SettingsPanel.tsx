"use client";

import { usePathname } from "next/navigation";
import {
  UserCog,
} from "lucide-react";

type SettingsPanelProps = {
  children: React.ReactNode;
  baseHref: string;
  showOtherCategories?: boolean;
};

export default function SettingsPanel({
  children,
}: SettingsPanelProps) {
  const pathname = usePathname();

  return (
<div>
  <h1 className="text-xl font-semibold text-[#0A1B39] mb-4">Settings</h1>
  <div className="border-b border-[#E5E7EB] mb-6" />

  <div className="flex rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">

      <aside className="w-[260px] shrink-0 border-r border-[#E5E7EB] p-4">
  <div className="flex items-center rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 mb-2">
  <UserCog size={18} className="text-[000000]" />

  <span className="ml-2 text-sm font-medium text-[#000000]">
    Account Settings
  </span>
</div>

      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  </div>
);}