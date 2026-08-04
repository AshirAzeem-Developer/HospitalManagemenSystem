'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export function usePagination() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Number(searchParams.get('page') ?? '1')
  const query = searchParams.get('q') ?? ''
  const limit = Number(searchParams.get('limit') ?? '10')

  function goToPage(newPage) {
    router.push(`${pathname}?q=${query}&page=${newPage}&limit=${limit}`)
  }

  function setQuery(newQuery) {
    router.push(`${pathname}?q=${newQuery}&page=1&limit=${limit}`)
  }

  function setLimit(newLimit) {
    router.push(`${pathname}?q=${query}&page=1&limit=${newLimit}`)
  }

  return { page, query, limit, goToPage, setQuery, setLimit }
}