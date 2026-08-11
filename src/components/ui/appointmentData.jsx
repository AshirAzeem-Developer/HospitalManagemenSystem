"use client";

import { useState, useMemo, useEffect } from 'react';
import PaginationControls from './PaginationControls'; 

export const appointmentFilterLogic = (data, searchTerm, activeFilters, sortOrder) => {
  // ... filter logic (same as your original code) ...
  let dateRange = null;

  if (activeFilters?.date) {
    const today = new Date();
    let start, end;

    switch (activeFilters.date) {
      case 'today':
        start = new Date(today);
        end = new Date(today);
        break;
      case 'yesterday':
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        end = new Date(start);
        break;
      case 'last_7_days':
        end = new Date(today);
        start = new Date(today);
        start.setDate(start.getDate() - 6);
        break;
      case 'this_month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'last_month':
        start = new Date(today.getFullYear() - 1, today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'this_year':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case 'last_year':
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case 'custom':
        if (activeFilters.customStart && activeFilters.customEnd) {
          start = new Date(activeFilters.customStart);
          end = new Date(activeFilters.customEnd);
        }
        break;
      default:
        start = null;
    }

    if (start && end) {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      dateRange = { start, end };
    }
  }

  const filteredData = (data || []).filter((app) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        app.patientName?.toLowerCase().includes(term) ||
        app.doctorName?.toLowerCase().includes(term) ||
        app.status?.toLowerCase().includes(term) ||
        app.date?.toLowerCase().includes(term);

      if (!matchesSearch) return false;
    }

    if (activeFilters?.status) {
      const itemStatus = app.status ? String(app.status).trim().toLowerCase() : "";
      const filterStatus = String(activeFilters.status).trim().toLowerCase();
      if (itemStatus !== filterStatus) return false;
    }

    if (activeFilters?.patient) {
      const pId = app.patientId?.toString();
      const filterP = activeFilters.patient.toString();
      const pName = app.patientName?.toLowerCase() || "";
      if (pId !== filterP && !pName.includes(filterP.toLowerCase())) return false;
    }

    if (activeFilters?.doctor) {
      const dId = app.doctorId?.toString();
      const filterD = activeFilters.doctor.toString();
      const dName = app.doctorName?.toLowerCase() || "";
      if (dId !== filterD && !dName.includes(filterD.toLowerCase())) return false;
    }

    if (dateRange && app.date) {
      const appDate = new Date(app.date);
      if (!isNaN(appDate.getTime())) {
        if (appDate < dateRange.start || appDate > dateRange.end) return false;
      }
    }

    return true;
  });

  return filteredData.sort((a, b) => {
    const timeA = a.time || '';
    const timeB = b.time || '';
    const dateA = new Date(`${a.date} ${timeA}`).getTime() || 0;
    const dateB = new Date(`${b.date} ${timeB}`).getTime() || 0;
    return sortOrder === 'Oldest' ? dateA - dateB : dateB - dateA;
  });
};

export default function DataContainer({
  initialData = [],
  HeaderComponent,
  headerProps = {}, // <-- NAYA PROP YAHAN ADD KIYA HAI
  ListComponent,
  filterSortLogic,
  onEditAction,
  onDeleteAction,
  listPropName = "data" 
}) {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Recent');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (Array.isArray(initialData)) {
      setData(initialData);
    }
  }, [initialData]);

  const handleEdit = async (updatedData) => {
    setData((prev) => prev.map((item) => (item.id === updatedData.id ? updatedData : item)));
    if (onEditAction) {
      const result = await onEditAction(updatedData.id, updatedData);
      if (result?.error) alert("Failed to update in database.");
    }
  };

  const handleDelete = async (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    if (onDeleteAction) {
      const result = await onDeleteAction(id);
      if (result?.error) alert("Failed to delete from database.");
    }
  };

  const filteredData = useMemo(() => {
    if (!filterSortLogic) return data;
    return filterSortLogic(data, searchTerm, activeFilters, sortOrder);
  }, [data, searchTerm, activeFilters, sortOrder, filterSortLogic]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (currentPage - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  const handleSearch = (term) => { setSearchTerm(term); setCurrentPage(1); };
  const handleFilterApply = (filters) => { setActiveFilters(filters); setCurrentPage(1); };
  const handleSortChange = (sort) => { setSortOrder(sort); setCurrentPage(1); };
  const handleLimitChange = (newLimit) => { setLimit(newLimit); setCurrentPage(1); };

  const listProps = {
    [listPropName]: paginatedData, 
    onEdit: handleEdit,
    onDelete: handleDelete
  };

  return (
    <div className="space-y-6">
      {HeaderComponent && (
        <HeaderComponent 
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          onFilterApply={handleFilterApply}
          onDateChange={(dateObj) => handleFilterApply({ ...activeFilters, date: dateObj.type, customStart: dateObj.start, customEnd: dateObj.end })}
          {...headerProps} 
        />
      )}

      <div className="bg-white rounded-md shadow-sm border border-slate-100 p-4 space-y-4">
        {ListComponent && <ListComponent {...listProps} />}

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