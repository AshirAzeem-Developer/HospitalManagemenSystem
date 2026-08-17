"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");

    const isDark = document.documentElement.classList.contains("dark");

    setDark(isDark);
  }

  return (
    <button
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full border border-[#E5E7EB] dark:border-[#3A4A63] flex items-center justify-center hover:bg-[#F7F8FC] dark:hover:bg-[#18243A] text-[#0A1B39] dark:text-[#CBD5E1]"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
