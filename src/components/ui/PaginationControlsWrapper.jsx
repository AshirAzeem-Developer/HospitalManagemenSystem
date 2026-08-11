'use client'
import usePagination from '@/hooks/usePagination'
import PaginationControls from '@/components/ui/PaginationControls'

export default function PaginationControlsWrapper({ page, totalPages, limit }) {
  const { goToPage, setLimit } = usePagination({ includeQuery: true })

  return (
    <div className="mt-4">
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={goToPage}
        limit={limit}
        onLimitChange={setLimit}
      />
    </div>
  )
}