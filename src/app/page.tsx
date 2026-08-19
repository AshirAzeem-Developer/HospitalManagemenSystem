"use client";

import Image from "next/image";
import { Dropdown } from "@/components/ui/select";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-white">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-white sm:items-start">
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Dropdown>
            <Dropdown.Trigger className="rounded-md border px-3 py-1.5 text-sm">
              Open menu
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Item onSelect={() => alert("clicked A")}>
                Option A
              </Dropdown.Item>
              <Dropdown.Item onSelect={() => alert("clicked B")}>
                Option B
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </main>
    </div>
  );
}
