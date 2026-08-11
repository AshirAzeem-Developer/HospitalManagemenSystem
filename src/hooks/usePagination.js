'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export default function usePagination({ includeQuery = true, queryKey = 'q' } = {}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Number(searchParams.get('page') ?? '1')
  const query = includeQuery ? (searchParams.get(queryKey) ?? '') : ''
  const limit = Number(searchParams.get('limit') ?? '10')

  function buildParams(nextPage, nextLimit, nextQuery = query) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(nextPage))
    params.set('limit', String(nextLimit))

    if (includeQuery) {
      params.set(queryKey, nextQuery)
    } else {
      params.delete(queryKey)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  function goToPage(newPage) {
    buildParams(newPage, limit)
  }

  function setQuery(newQuery) {
    buildParams(1, limit, newQuery)
  }

  function setLimit(newLimit) {
    buildParams(1, newLimit)
  }

  return { page, query, limit, goToPage, setQuery, setLimit }
}