import { createClient } from '@/lib/supabase/server'
import { paginateQuery } from '@/lib/paginateQuery'
import PaginationSearchBar from '@/components/ui/PaginationSearchBar'
import PaginationControlsWrapper from '@/components/ui/PaginationControlsWrapper'

export default async function TestRealPaginationPage({ searchParams }) {
  const params = await searchParams
  const page = Number(params.page ?? '1')
  const limit = Number(params.limit ?? '10')
  const query = params.q ?? ''

  const supabase = await createClient()

  let dbQuery = supabase.from('doctors').select('id, specialization, consultation_fee')

  if (query) {
    dbQuery = dbQuery.ilike('specialization', `%${query}%`)
  }

  const { data: doctors, totalPages } = await paginateQuery(dbQuery, { page, limit })

  return (
    <div className="p-8 max-w-2xl">
      <h3 className="text-lg font-semibold mb-4">Doctors (Real Data)</h3>
      <PaginationSearchBar placeholder="Search doctors" />

      <ul className="mb-6 space-y-2">
        {doctors.length === 0 && <li className="text-sm text-gray-400">No doctors found.</li>}
        {doctors.map((doctor) => (
          <li key={doctor.id} className="text-sm">
            {doctor.specialization} — ${doctor.consultation_fee}
          </li>
        ))}
      </ul>

      <PaginationControlsWrapper page={page} totalPages={totalPages} limit={limit} />
    </div>
  )
}