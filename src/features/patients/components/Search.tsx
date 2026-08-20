"use client";

type SearchProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function Search({
  search,
  setSearch,
}: SearchProps) {
  return (
    <input
      type="text"
      placeholder="Search patients..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="
        h-10
        w-full
        sm:w-64
        rounded-md
        border
        border-slate-200
        bg-white
        px-3
        text-sm
        text-slate-900
        placeholder:text-slate-400
        outline-none
        focus:border-slate-500
        dark:border-gray-700
        dark:bg-gray-900
        dark:text-white
        dark:placeholder:text-gray-500
        dark:focus:border-gray-500
      "
    />
  );
}