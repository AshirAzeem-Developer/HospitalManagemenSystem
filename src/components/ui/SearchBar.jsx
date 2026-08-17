"use client";

export default function SearchBar({
  defaultValue = "",
  onSearch,
  placeholder = "Search",
}) {
  return (
    <div
      className="
        m-[10px]
        flex h-8 w-[250px] items-center
        rounded-md
        border border-[#E7E8EB]
        bg-white
        px-3 py-[6px]
      "
    >
      <input
        type="text"
        defaultValue={defaultValue}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="
          h-full w-full
          border-none
          bg-transparent
          text-sm
          text-[#0A1B39]
          outline-none
          placeholder:text-[#98A2B3]
        "
      />
    </div>
  );
}
