"use client";

export default function SearchBar({
  defaultValue = "",
  onSearch,
  placeholder = "Search",
}) {
  return (
    <div
      className="
        flex h-10 w-full max-w-[320px] items-center
        rounded-md
        border border-border
        bg-background
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
          text-foreground
          outline-none
          placeholder:text-muted
        "
      />
    </div>
  );
}
