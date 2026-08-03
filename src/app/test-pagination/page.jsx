'use client'
import { usePagination } from '@/hooks/usePagination'

const fakeDoctors = [
  'Dr. Ahmed', 'Dr. Sara', 'Dr. Bilal', 'Dr. Ayesha', 'Dr. Hamza',
  'Dr. Zainab', 'Dr. Usman', 'Dr. Mahnoor', 'Dr. Faisal', 'Dr. Iqra',
  'Dr. Kashif', 'Dr. Sana', 'Dr. Adeel', 'Dr. Hina', 'Dr. Waqas',
  'Dr. Rabia', 'Dr. Tariq'
]

const ITEMS_PER_PAGE = 5

export default function TestPage() {
  const { page, query, goToPage, setQuery } = usePagination()

  // Step 1: filter first, based on current search text
  const filteredDoctors = fakeDoctors.filter((doctor) =>
    doctor.toLowerCase().includes(query.toLowerCase())
  )

  // Step 2: NOW calculate totalPages from the FILTERED count, not the original 17
  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE))

  // Step 3: slice the filtered list for the current page
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const doctorsToShow = filteredDoctors.slice(startIndex, endIndex)

  return (
    <div>
      <input
        type="text"
        placeholder="Search doctors..."
        defaultValue={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <h3>Doctors (Page {page} of {totalPages})</h3>
      <ul>
        {doctorsToShow.map((doctor) => (
          <li key={doctor}>{doctor}</li>
        ))}
      </ul>
      <button onClick={() => goToPage(page - 1)} disabled={page <= 1}>
        Previous Page
      </button>
      <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
        Next Page
      </button>
    </div>
  )
}