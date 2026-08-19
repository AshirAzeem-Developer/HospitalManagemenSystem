'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiChevronLeft, FiPlus, FiCalendar, FiClock, FiChevronDown } from "react-icons/fi";

import { getPatients, getDoctors, getStatuses, createAppointmentAction 
} from '@/features/appointments/appointmentActions/appointmentAction';

export default function NewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Dropdown open states
  const [patientOpen, setPatientOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);
  
  // Refs for Date and Time pickers
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    status: 'confirmed' // Status automatically 'confirmed' set kardi hai
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      const [patientsData, doctorsData, statusesData] = await Promise.all([
        getPatients(),
        getDoctors(),
        getStatuses()
      ]);
      if (patientsData) setPatients(patientsData);
      if (doctorsData) setDoctors(doctorsData);
      if (statusesData) setStatuses(statusesData);
    };
    fetchDropdowns();
  }, []);

 const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'date' && value && value < todayStr) {
    return;
  }

  setFormData(prev => ({ ...prev, [name]: value }));
};

  const handleDropdownSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Agar database se statuses aye hain toh wahan se 'confirmed' ki ID nikal lein
    // warna simple string 'confirmed' pass kar dein
    let finalStatus = 'confirmed';
    if (statuses.length > 0) {
      const confirmStatusObj = statuses.find(s => (s.name || s.status)?.toLowerCase() === 'confirmed');
      if (confirmStatusObj) {
        finalStatus = confirmStatusObj.id;
      }
    }

    const response = await createAppointmentAction({ ...formData, status: finalStatus });
    
    setLoading(false);
    if (response.success) {
      router.push('/admin/appointments'); 
    } else {
      alert("Error: " + response.message);
    }
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const selectedDoctor = doctors.find(d => d.id === formData.doctorId);

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      
      <div className="mb-6">
        <Link href="/admin/appointments" className="flex items-center text-foreground font-bold text-lg hover:underline w-fit">
          <FiChevronLeft className="mr-1 w-5 h-5" /> Appointments
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-background border border-border rounded-xl p-8 shadow-sm max-w-5xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* PATIENT FIELD */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-foreground">
                Patient <span className="text-red-500">*</span>
              </label>
              <Link href="/admin/patients/NewPatient" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition">
                <FiPlus className="mr-1" /> Add New
              </Link>
            </div>
            
            <div className="relative w-full">
              <button 
                type="button" 
                onClick={() => { setPatientOpen(!patientOpen); setDoctorOpen(false); }}
                className="w-full flex justify-between items-center border border-border rounded-lg p-3 text-sm text-foreground bg-background focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <span className="truncate">{selectedPatient?.profile?.full_name || "Select Patient"}</span>
                <FiChevronDown className="text-muted flex-shrink-0" />
              </button>

              {patientOpen && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-[200px] overflow-y-auto bg-background border border-border shadow-lg rounded-lg z-50">
                  <ul className="py-1">
                    <li 
                      onClick={() => { handleDropdownSelect('patientId', ''); setPatientOpen(false); }}
                      className="px-4 py-2 hover:bg-hover cursor-pointer text-sm text-muted"
                    >
                      Select Patient
                    </li>
                    {patients.map(p => (
                      <li 
                        key={p.id} 
                        onClick={() => { handleDropdownSelect('patientId', p.id); setPatientOpen(false); }}
                        className="px-4 py-2 hover:bg-hover cursor-pointer text-sm text-foreground border-b border-border last:border-0"
                      >
                        {p.profile?.full_name || "Unknown"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <input type="hidden" name="patientId" value={formData.patientId} required />
          </div>

          {/* DOCTOR FIELD */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Doctor <span className="text-red-500">*</span>
            </label>
            
            <div className="relative w-full">
              <button 
                type="button" 
                onClick={() => { setDoctorOpen(!doctorOpen); setPatientOpen(false); }}
                className="w-full flex justify-between items-center border border-border rounded-lg p-3 text-sm text-foreground bg-background focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <span className="truncate">{selectedDoctor?.profile?.full_name || "Select Doctor"}</span>
                <FiChevronDown className="text-muted flex-shrink-0" />
              </button>

              {doctorOpen && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-[200px] overflow-y-auto bg-background border border-border shadow-lg rounded-lg z-50">
                  <ul className="py-1">
                    <li 
                      onClick={() => { handleDropdownSelect('doctorId', ''); setDoctorOpen(false); }}
                      className="px-4 py-2 hover:bg-hover cursor-pointer text-sm text-muted"
                    >
                      Select Doctor
                    </li>
                    {doctors.map(d => (
                      <li 
                        key={d.id} 
                        onClick={() => { handleDropdownSelect('doctorId', d.id); setDoctorOpen(false); }}
                        className="px-4 py-2 hover:bg-hover cursor-pointer text-sm text-foreground border-b border-border last:border-0"
                      >
                        {d.profile?.full_name || "Unknown"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <input type="hidden" name="doctorId" value={formData.doctorId} required />
          </div>

          {/* Date Field */}
<div className="relative">
  <label className="block text-sm font-semibold text-foreground mb-2">Date of Appointment <span className="text-red-500">*</span></label>
  <div className="relative">
    <input
      ref={dateRef}
      type="date"
      name="date"
      value={formData.date}
      onChange={handleChange}
      onKeyDown={(e) => e.preventDefault()}
      min={todayStr}
      required
      className="w-full border border-border rounded-lg p-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-background [color-scheme:light_dark] cursor-pointer"
    />
    <FiCalendar onClick={() => dateRef.current?.showPicker?.()} className="absolute right-3 top-3.5 text-muted cursor-pointer" />
  </div>
</div>

          {/* Time Field */}
          <div className="relative">
            <label className="block text-sm font-semibold text-foreground mb-2">Time <span className="text-red-500">*</span></label>
            <div className="relative">
              <input ref={timeRef} type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full border border-border rounded-lg p-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-background [color-scheme:light_dark]" />
              <FiClock onClick={() => timeRef.current?.showPicker?.()} className="absolute right-3 top-3.5 text-muted cursor-pointer" />
            </div>
          </div>

          {/* Appointment Reason */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">Appointment Reason <span className="text-red-500">*</span></label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} rows="4" required placeholder="Enter reason here..." className="w-full border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-background placeholder:text-muted"></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end items-center gap-4 border-t pt-6 border-border">
          <Link href="/admin/appointments" className="px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-hover rounded-lg transition">Cancel</Link>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-70">
            {loading ? 'Creating...' : 'Create Appointment'}
          </button>
        </div>

      </form>

      {/* Background overlay to close dropdowns when clicking outside */}
      {(patientOpen || doctorOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setPatientOpen(false); setDoctorOpen(false); }}></div>
      )}
    </div>
  );
}