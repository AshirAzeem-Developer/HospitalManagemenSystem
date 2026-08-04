'use client'
import { usePagination } from '@/hooks/usePagination'
import SearchBar from '@/components/ui/SearchBar'
import PaginationControls from '@/components/ui/PaginationControls'

const fakeDoctors = [
  'Dr. Ahmed',
  'Dr. Sara',
  'Dr. Bilal',
  'Dr. Ayesha',
  'Dr. Hamza',
  'Dr. Zainab',
  'Dr. Usman',
  'Dr. Mahnoor',
  'Dr. Faisal',
  'Dr. Iqra',
  'Dr. Kashif',
  'Dr. Sana',
  'Dr. Adeel',
  'Dr. Hina',
  'Dr. Waqas',
  'Dr. Rabia',
  'Dr. Tariq',
  'Dr. Maryam',
  'Dr. Saad',
  'Dr. Komal',
  'Dr. Hassan',
  'Dr. Nimra',
  'Dr. Ali',
  'Dr. Fatima',
  'Dr. Omer',
  'Dr. Laiba',
  'Dr. Hamid',
  'Dr. Anam',
  'Dr. Shahzaib',
  'Dr. Madiha',
  'Dr. Imran',
  'Dr. Kiran',
  'Dr. Salman',
  'Dr. Alina',
  'Dr. Farhan',
  'Dr. Mehwish',
  'Dr. Arslan',
  'Dr. Nida',
  'Dr. Yasir',
  'Dr. Saba',
  'Dr. Saif',
  'Dr. Eman',
  'Dr. Haris',
  'Dr. Amna',
  'Dr. Danish',
  'Dr. Sehrish',
  'Dr. Naveed',
  'Dr. Sidra',
  'Dr. Shahid',
  'Dr. Minahil',
  'Dr. Asad',
  'Dr. Rida',
  'Dr. Junaid',
  'Dr. Momina',
  'Dr. Rizwan',
  'Dr. Hareem',
  'Dr. Adnan',
  'Dr. Bushra',
  'Dr. Noman',
  'Dr. Alishba',
  'Dr. Kamran',
  'Dr. Areeba',
  'Dr. Sohail',
  'Dr. Hoorain',
  'Dr. Irfan',
  'Dr. Anaya',
  'Dr. Zeeshan',
  'Dr. Dua',
  'Dr. Faisal',
  'Dr. Noor',
  'Dr. Azhar',
  'Dr. Amina',
  'Dr. Jawad',
  'Dr. Minsa',
  'Dr. Shahmeer',
  'Dr. Iman',
  'Dr. Talha',
  'Dr. Zoya',
  'Dr. Rauf',
  'Dr. Maham'
];

export default function TestPage() {
  const { page, query, limit, goToPage, setQuery, setLimit } = usePagination()

  // Step 1: filter first, based on current search text
  const filteredDoctors = fakeDoctors.filter((doctor) =>
    doctor.toLowerCase().includes(query.toLowerCase())
  )

  // Step 2: NOW calculate totalPages from the FILTERED count, not the original 17
  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / limit))

  // Step 3: slice the filtered list for the current page
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const doctorsToShow = filteredDoctors.slice(startIndex, endIndex)

  return (
    <div>
      <SearchBar
        defaultValue={query}
        onSearch={setQuery}
        placeholder="Search doctors..."
      />
      <h3>Doctors (Page {page} of {totalPages})</h3>
      <ul>
        {doctorsToShow.map((doctor) => (
          <li key={doctor}>{doctor}</li>
        ))}
      </ul>
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