'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export function usePagination() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Number(searchParams.get('page') ?? '1')
  const query = searchParams.get('q') ?? ''

  function goToPage(newPage) {
    router.push(`${pathname}?q=${query}&page=${newPage}`)
  }

  function setQuery(newQuery) {
    router.push(`${pathname}?q=${newQuery}&page=1`)
  }

  return { page, query, goToPage, setQuery }
}