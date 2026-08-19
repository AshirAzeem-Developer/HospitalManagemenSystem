"use client";

import { usePathname } from "next/navigation";
import { UserCog } from "lucide-react";

type SettingsPanelProps = {
  children: React.ReactNode;
  baseHref: string;
  showOtherCategories?: boolean;
};

export default function SettingsPanel({ children }: SettingsPanelProps) {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0A1B39] dark:text-[#F8FAFC] mb-4">
        Settings
      </h1>
      <div className="border-b border-[#E5E7EB] dark:border-[#2A3850] mb-6" />

<div className="flex flex-col lg:flex-row rounded-xl border border-[#E5E7EB] dark:border-[#2A3850] bg-white dark:bg-[#091326] overflow-hidden">        <aside className="w-full lg:w-[220px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] dark:border-[#2A3850] p-4">
          <div className="flex items-center rounded-lg border border-[#E5E7EB] dark:border-[#4C4A78] bg-white dark:bg-[#211E46] px-4 py-3 mb-2">
            <UserCog size={18} className="text-[#000000] dark:text-[#A78BFA]" />
            <span className="ml-2 text-sm font-medium text-[#000000] dark:text-[#F8FAFC]">
              Account Settings
            </span>
          </div>
        </aside>
<div className="flex-1 p-4 lg:p-6 min-w-0 dark:bg-[#152035]">
  {children}
</div>
      </div>
    </div>
  );
}