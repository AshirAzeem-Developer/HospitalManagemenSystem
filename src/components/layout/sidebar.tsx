"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "./nav-links";

export function Sidebar({
  links,
  roleLabel,
}: {
  links: NavLink[];
  roleLabel: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-sm font-medium text-slate-400">Hospital MS</p>
        <p className="text-base font-semibold text-slate-900">{roleLabel}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
