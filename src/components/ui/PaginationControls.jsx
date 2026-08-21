"use client";

export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}) {
  function getPageNumbers() {
    const pages = [];
    pages.push(1);

    const windowStart = Math.max(2, page - 1);
    const windowEnd = Math.min(totalPages - 1, page + 1);

    if (windowStart > 2) {
      pages.push("...");
    }

    for (let p = windowStart; p <= windowEnd; p++) {
      pages.push(p);
    }

    if (windowEnd < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  const pageNumbers = getPageNumbers();

  const buttonBase =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-sm text-foreground shadow-sm";

  // Normal pagination button
  const inactiveStyle =
    `${buttonBase} ` +
    "cursor-pointer hover:bg-hover";

  // Active pagination button
  const activeStyle =
    `${buttonBase} ` +
    "cursor-pointer border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <div className="flex w-full flex-col gap-3 sm:h-8 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
      {/* Left side */}
      <div className="flex h-8 items-center gap-2">
        <span className="text-sm text-muted">Show</span>

        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="
            h-8
            px-2
            border
            border-border
            rounded-md
            text-sm
            bg-background
            text-foreground
            shadow-sm
            outline-none
            cursor-pointer
            focus:border-[#2E37A4]
          "
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>

        <span className="text-sm text-muted">Results</span>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-end gap-1.5 sm:gap-3">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`${inactiveStyle} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          ←
        </button>

        {/* Page numbers */}
        {pageNumbers.map((p, index) =>
          p === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="
                flex
                items-center
                justify-center
                w-8
                h-8
                text-sm
                text-muted
              "
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={p === page ? activeStyle : inactiveStyle}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`${inactiveStyle} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          →
        </button>
      </div>
    </div>
  );
}
