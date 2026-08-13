"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function usePagination(totalPages: number) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const goToPage = useCallback(
    (page: number) => {
      const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(safePage));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, totalPages],
  );

  return {
    currentPage,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
    goToPage,
  };
}
