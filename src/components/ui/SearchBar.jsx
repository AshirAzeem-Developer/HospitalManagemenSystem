'use client'

export default function SearchBar({
  defaultValue = '',
  onSearch,
  placeholder = 'Search',
}) {
  return (
    <div
      className="
        m-[10px]
        flex h-8 w-[250px] items-center
        rounded-md
        border border-[#E7E8EB] dark:border-slate-700
        bg-background
        px-3 py-[6px]
        shadow-[0px_1px_1px_rgba(0,0,0,0.05)]
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
          outline-none
          text-foreground
          placeholder:text-foreground/50
        "
      />
    </div>
  )
}