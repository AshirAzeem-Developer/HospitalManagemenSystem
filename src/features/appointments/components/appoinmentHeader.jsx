'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dropdown } from '@/components/ui/select';
import Button from '@/components/ui/button';       
import SearchBar from '@/components/ui/SearchBar'; 
import { FiList, FiCalendar, FiFilter, FiPlus } from "react-icons/fi";

import { 
  getPatients, 
  getDoctors 
} from '@/features/appointments/appointmentActions/appointmentAction'; 

export default function AppointmentHeader({
  title = "Appointment",
  currentView = "list",
  newAppointmentUrl = "/admin/appointments/NewAppointment",
  
  onSearch,
  onSortChange,
  onViewChange,
  onDateChange,
  onFilterApply,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Recent');
  
  const [topDateLabel, setTopDateLabel] = useState('Select Date');
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const statuses = [
    { id: 'pending', name: 'Pending' },
    { id: 'confirmed', name: 'Confirmed' },
    { id: 'completed', name: 'Completed' },
    { id: 'cancelled', name: 'Cancelled' }
  ];

  const initialFilterState = { 
    patient: '', doctor: '',
    date: '', customStart: '', customEnd: '', status: '' 
  };
  const [filterState, setFilterState] = useState(initialFilterState);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [patientsData, doctorsData] = await Promise.all([
          getPatients(),
          getDoctors()
        ]);

        if (patientsData) setPatients(patientsData);
        if (doctorsData) setDoctors(doctorsData);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleResetField = (field) => {
    if (field === 'date') {
      const updated = { ...filterState, date: '', customStart: '', customEnd: '' };
      setFilterState(updated);
      onFilterApply?.(updated);
    } else {
      const updated = { ...filterState, [field]: '' };
      setFilterState(updated);
      onFilterApply?.(updated);
    }
  };
  
  const handleClearAll = () => {
    setFilterState(initialFilterState);
    onFilterApply?.(initialFilterState);
  };

  const handleChange = (field, val) => {
    setFilterState(prev => ({ ...prev, [field]: val }));
  };

  const dateOptions = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last_7_days', label: 'Last 7 days' },
    { id: 'this_month', label: 'This month' },
    { id: 'last_month', label: 'Last month' },
    { id: 'this_year', label: 'This year' },
    { id: 'last_year', label: 'Last year' },
    { id: 'custom', label: 'Custom Range' },
  ];

  // Doctors aur Patients dono ka name access fixed:
  const selectFilters = [
    { key: 'patient', label: 'Patient', items: patients, displayKey: 'profile.full_name' }, 
    { key: 'doctor', label: 'Doctor', items: doctors, displayKey: 'profile.full_name' }, 
    { key: 'status', label: 'Status', items: statuses, displayKey: 'name' }, 
  ];

  const renderSelectField = (filter) => {
    const { key, label, items, displayKey } = filter;
    
    return (
      <div key={`filter-wrap-${key}`}>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-bold text-[#0a1b39]">{label}</label>
          <button type="button" onClick={() => handleResetField(key)} className="text-sm font-medium text-indigo-600 hover:underline">
            Reset
          </button>
        </div>
        <select 
          value={filterState[key]} 
          onChange={(e) => handleChange(key, e.target.value)} 
          className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-white outline-none focus:border-indigo-500 text-gray-700"
        >
          <option value="">Select</option>
          
          {items && items.map((item, index) => {
            let displayValue = '';
            
            if (displayKey) {
               const keys = displayKey.split('.');
               displayValue = keys.reduce((acc, curr) => acc && acc[curr], item);
            }

            if (!displayValue || typeof displayValue === 'object') {
               displayValue = item?.name || item?.full_name || item?.label || item?.id || `Option ${index + 1}`;
            }

            const optionValue = displayValue || item?.id || index;
            const uniqueKey = `${key}-opt-${index}`;

            return (
              <option key={uniqueKey} value={optionValue}>
                {displayValue}
              </option>
            )
          })}
        </select>
      </div>
    );
  };

  return (
    <div className="w-full text-black bg-[#F5F6F8] p-4 shadow-sm space-y-4 rounded-lg">
      
      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0a1b39]">{title}</h1>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#f5f6f8] p-1 rounded-lg border border-[#e7e8eb]">
            <button type="button" onClick={() => onViewChange?.('list')} className={`p-1.5 rounded-md transition ${currentView === 'list' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500'}`}>
              <FiList className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => onViewChange?.('calendar')} className={`p-1.5 rounded-md transition ${currentView === 'calendar' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500'}`}>
              <FiCalendar className="w-4 h-4" />
            </button>
          </div>

          <Link href={newAppointmentUrl}>
            <Button variant="primary" text="New Appointment" icon={<FiPlus />} />
          </Link>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e7e8eb]">
        
        <div className="flex flex-wrap items-center gap-1">
          <SearchBar 
            defaultValue={searchTerm} 
            onSearch={(val) => { setSearchTerm(val); onSearch?.(val); }} 
            placeholder="Search" 
          />

          <Dropdown>
            <Dropdown.Trigger className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e7e8eb] rounded-lg text-sm text-[#0a1b39] hover:bg-[#f5f6f8]">
              <FiCalendar className="w-4 h-4 text-gray-500" />
              <span>{topDateLabel}</span>
            </Dropdown.Trigger>
            <Dropdown.Content align="left">
              {dateOptions.map((opt, idx) => (
                <Dropdown.Item key={`top-date-${opt.id}-${idx}`} onSelect={() => { 
                  setTopDateLabel(opt.label);
                  setIsCustomDate(opt.id === 'custom');
                  if (opt.id !== 'custom') onDateChange?.({ type: opt.id });
                }}>
                  {opt.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>

          {isCustomDate && (
            <div className="flex items-center gap-2 ml-2">
              <input type="date" value={customStart} onChange={(e) => { setCustomStart(e.target.value); onDateChange?.({ type: 'custom', start: e.target.value, end: customEnd }); }} className="text-sm border border-[#e7e8eb] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-700" />
              <span className="text-gray-400 text-sm">to</span>
              <input type="date" value={customEnd} onChange={(e) => { setCustomEnd(e.target.value); onDateChange?.({ type: 'custom', start: customStart, end: e.target.value }); }} className="text-sm border border-[#e7e8eb] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-700" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          
          <Dropdown>
            <Dropdown.Trigger className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-[#e7e8eb] rounded-lg hover:bg-[#f5f6f8] text-[#0a1b39]">
              <FiFilter className="w-4 h-4 text-gray-500" />
              Filters
            </Dropdown.Trigger>

            <Dropdown.Content align="right" className="w-[360px] p-5 rounded-xl border border-gray-200 shadow-2xl bg-white space-y-4">
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-xl font-bold text-[#0a1b39]">Filter</h3>
                <button type="button" onClick={handleClearAll} className="text-sm font-semibold text-red-600 hover:underline">
                  Clear All
                </button>
              </div>

              {/* Patient aur Doctor fields */}
              {selectFilters.slice(0, 2).map(filter => renderSelectField(filter))}

              {/* Date Field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-[#0a1b39]">Date</label>
                  <button type="button" onClick={() => handleResetField('date')} className="text-sm font-medium text-indigo-600 hover:underline">
                    Reset
                  </button>
                </div>
                
                <select 
                  value={filterState.date} 
                  onChange={(e) => handleChange('date', e.target.value)} 
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-white outline-none focus:border-indigo-500 text-gray-700"
                >
                  <option value="">Select</option>
                  {dateOptions.map((opt, idx) => (
                    <option key={`popup-date-${opt.id}-${idx}`} value={opt.id}>{opt.label}</option>
                  ))}
                </select>

                {filterState.date === 'custom' && (
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="date" 
                      value={filterState.customStart} 
                      onChange={(e) => handleChange('customStart', e.target.value)} 
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 text-gray-700" 
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <input 
                      type="date" 
                      value={filterState.customEnd} 
                      onChange={(e) => handleChange('customEnd', e.target.value)} 
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 text-gray-700" 
                    />
                  </div>
                )}
              </div>

              {/* Status field */}
              {selectFilters.slice(2).map(filter => renderSelectField(filter))}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <Button 
                  variant="primary" 
                  text="Apply Filter" 
                  onClick={() => onFilterApply?.(filterState)} 
                />
              </div>

            </Dropdown.Content>
          </Dropdown>

          {/* Sort By Dropdown */}
          <Dropdown>
            <Dropdown.Trigger className="flex items-center gap-1.5 px-3 py-2 text-sm bg-white border border-[#e7e8eb] rounded-lg text-[#0a1b39] hover:bg-[#f5f6f8]">
              <span className="text-gray-500">Sort By :</span>
              <span className="font-semibold">{sortBy}</span>
            </Dropdown.Trigger>
            <Dropdown.Content align="right">
              {['Recent', 'Oldest'].map((s, idx) => (
                <Dropdown.Item key={`sort-${s}-${idx}`} onSelect={() => { setSortBy(s); onSortChange?.(s); }}>
                  {s}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>

        </div>
      </div>
    </div>
  );
}