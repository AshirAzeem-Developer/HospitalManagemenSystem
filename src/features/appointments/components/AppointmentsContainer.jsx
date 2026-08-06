'use client';

import { useState, useMemo } from 'react';
import AppointmentHeader from './appoinmentHeader';
import AppointmentsList from './appointmentList';
import PaginationControls from '../../../components/ui/PaginationControls'; 

export default function AppointmentsContainer({ initialAppointments = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Recent');
  const [activeFilters, setActiveFilters] = useState({
    patient: '', doctor: '', status: '', date: ''
  });

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); 

  // 1. Pehle data ko filter aur sort karein
  const filteredAppointments = useMemo(() => {
    return initialAppointments
      .filter((app) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchPatient = app.patientName?.toLowerCase().includes(term);
          const matchDoctor = app.doctorName?.toLowerCase().includes(term);
          const matchStatus = app.status?.toLowerCase().includes(term);
          if (!matchPatient && !matchDoctor && !matchStatus) return false;
        }

        if (activeFilters.status && app.status?.toLowerCase() !== activeFilters.status.toLowerCase()) return false;
        
        if (activeFilters.patient && app.patientId !== activeFilters.patient && app.patientName !== activeFilters.patient) {
            if (!app.patientName?.toLowerCase().includes(activeFilters.patient.toLowerCase())) return false;
        }

        if (activeFilters.doctor && !app.doctorName?.toLowerCase().includes(activeFilters.doctor.toLowerCase())) return false;

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time || ''}`);
        const dateB = new Date(`${b.date} ${b.time || ''}`);
        return sortOrder === 'Oldest' ? dateA - dateB : dateB - dateA;
      });
  }, [initialAppointments, searchTerm, activeFilters, sortOrder]);

  // --- 2. Pagination Logic Apply Karein ---
  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / limit) || 1; // Kam se kam 1 page zaroor ho

  // Sirf current page ka data nikalen (Slice karein)
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  // Handlers for Search & Filter (jab filter change ho toh page 1 par chale jayein)
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset page
  };

  const handleFilterApply = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset page
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Jab limit badle tab bhi page 1 par aayein
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AppointmentHeader 
        onSearch={handleSearch}
        onSortChange={(sort) => setSortOrder(sort)}
        onFilterApply={handleFilterApply}
      />

      {/* Table & Pagination Box */}
      <div className="bg-white rounded-md shadow-sm border border-slate-100 p-4 space-y-4">
        
        {/* Table mein ab filtered list nahi, balke paginated list bhejni hai */}
        <AppointmentsList appointments={paginatedAppointments} />

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <div className="pt-4 border-t border-[#E7E8EB]">
            <PaginationControls 
              page={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => setCurrentPage(page)} 
              limit={limit} 
              onLimitChange={handleLimitChange} 
            />
          </div>
        )}
        
      </div>
    </div>
  );
}