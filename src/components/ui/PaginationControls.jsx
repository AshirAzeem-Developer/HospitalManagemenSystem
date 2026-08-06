'use client'

export default function PaginationControls({ page, totalPages, onPageChange, limit, onLimitChange }) {
  function getPageNumbers() {
    const pages = []
    pages.push(1)

    const windowStart = Math.max(2, page - 1)
    const windowEnd = Math.min(totalPages - 1, page + 1)

    if (windowStart > 2) {
      pages.push('...')
    }

    for (let p = windowStart; p <= windowEnd; p++) {
      pages.push(p)
    }

    if (windowEnd < totalPages - 1) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  // NOTE: bg-white and border-[#E7E8EB] removed from here on purpose —
  // they now live only in the "inactive" branch below, so they never
  // fight with the active button's purple background/border classes.
  const buttonBase =
    'flex items-center justify-center w-8 h-8 rounded-md border shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-sm'

  const inactiveStyle = `${buttonBase} bg-white border-[#E7E8EB] cursor-pointer hover:bg-[#F3F4F6] hover:border-[#D1D5DB]`
  const activeStyle = `${buttonBase} bg-[#2E37A4] border-[#2E37A4] text-white cursor-pointer`

  return (
    <div className="flex items-center justify-between w-full h-8 gap-5">
      <div className="flex items-center gap-2 h-8">
        <span className="text-sm text-[#6B7280]">Show</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="h-8 px-2 border border-[#E7E8EB] rounded-md text-sm bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] outline-none cursor-pointer"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-sm text-[#6B7280]">Results</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`${inactiveStyle} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          ←
        </button>

        {pageNumbers.map((p, index) =>
          p === '...' ? (
            <span key={`ellipsis-${index}`} className={`${buttonBase} border-none shadow-none`}>
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

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`${inactiveStyle} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          →
        </button>
      </div>
    </div>
  )
}



