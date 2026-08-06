"use client";

import { usePagination } from "@/hooks/use-pagination";

export function Pagination({ totalPages }: { totalPages: number }) {
  const { currentPage, hasPrev, hasNext, nextPage, prevPage } =
    usePagination(totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-2 py-3">
      <button
        onClick={prevPage}
        disabled={!hasPrev}
        className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={nextPage}
        disabled={!hasNext}
        className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
