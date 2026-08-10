'use client'

import usePagination from '@/hooks/usePagination'
import SearchBar from '@/components/ui/SearchBar'

export default function PaginationSearchBar({ placeholder = 'Search' }) {
  const { query, setQuery } = usePagination({ includeQuery: true })

  return <SearchBar defaultValue={query} onSearch={setQuery} placeholder={placeholder} />
}