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
        bg-white
        border
        border-slate-200
        px-3
        text-sm
        outline-none
        focus:border-slate-500
      "
    />
  );
}