'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiChevronLeft, FiPlus, FiCalendar, FiClock, FiChevronDown } from "react-icons/fi";

import { 
  getPatients, 
  getDoctors, 
  getStatuses, 
  createAppointmentAction,
  getDoctorSchedule 
} from '@/features/appointments/appointmentActions/appointmentAction';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function AppointmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const preSelectedPatientId = searchParams.get('patientId') || '';
  const preSelectedDoctorId = searchParams.get('doctorId') || '';

  const [loading, setLoading] = useState(false);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [statuses, setStatuses] = useState([]);
  
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [patientOpen, setPatientOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: preSelectedPatientId, 
    doctorId: preSelectedDoctorId,   
    date: '',
    time: '',
    reason: '',
    status: 'confirmed'
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

  // Fetch Schedule on Doctor Select & Generate Available Dates
  useEffect(() => {
    const fetchSchedule = async () => {
      if (formData.doctorId) {
        const scheduleData = await getDoctorSchedule(formData.doctorId);
        setDoctorSchedule(scheduleData || []);
        
        // Reset selections
        setFormData(prev => ({ ...prev, date: '', time: '' }));
        setAvailableTimes([]);

        // Generate Dates for next 30 days
        if (scheduleData && scheduleData.length > 0) {
          generateAvailableDates(scheduleData);
        } else {
          setAvailableDates([]);
        }
      }
    };
    fetchSchedule();
  }, [formData.doctorId]);

  // Generate Available Dates based on Doctor Schedule
  const generateAvailableDates = (schedule) => {
    const datesList = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayOfWeekNum = currentDate.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

      // Check if day is in doctor's schedule
      const isAvailable = schedule.some(s => 
        Number(s.day_of_week) === dayOfWeekNum || 
        (dayOfWeekNum === 0 && Number(s.day_of_week) === 7)
      );

      if (isAvailable) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD

        const displayLabel = `${DAY_NAMES[dayOfWeekNum]}, ${currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

        datesList.push({ dateStr, displayLabel, dayOfWeekNum });
      }
    }
    setAvailableDates(datesList);
  };

  // Generate Slots based on start_time, end_time, and slot_duration_minutes
  const generateTimeSlots = (start, end, durationMinutes = 30) => {
    const slots = [];
    let current = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);

    while (current < endTime) {
      slots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      current.setMinutes(current.getMinutes() + Number(durationMinutes));
    }
    setAvailableTimes(slots);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'date' && value) {
      const selectedDateObj = new Date(value);
      const dayOfWeekNum = selectedDateObj.getDay();

      const daySchedule = doctorSchedule.find(s => 
        Number(s.day_of_week) === dayOfWeekNum || 
        (dayOfWeekNum === 0 && Number(s.day_of_week) === 7)
      );

      if (daySchedule) {
        generateTimeSlots(daySchedule.start_time, daySchedule.end_time, daySchedule.slot_duration_minutes);
        setFormData(prev => ({ ...prev, date: value, time: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDropdownSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
  
  const isPatientFixed = !!preSelectedPatientId; 
  const isDoctorFixed = !!preSelectedDoctorId; 

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
              {!isPatientFixed && (
                <Link href="/admin/patients/NewPatient" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition">
                  <FiPlus className="mr-1" /> Add New
                </Link>
              )}
            </div>
            
            <div className="relative w-full">
              <button 
                type="button" 
                onClick={() => { if (!isPatientFixed) { setPatientOpen(!patientOpen); setDoctorOpen(false); } }}
                className={`w-full flex justify-between items-center border border-border rounded-lg p-3 text-sm transition ${isPatientFixed ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-80' : 'bg-background text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
              >
                <span className="truncate">
                  {selectedPatient?.profile?.full_name 
                    ? selectedPatient.profile.full_name 
                    : (isPatientFixed ? "Loading Patient..." : "Select Patient")}
                </span>
                {!isPatientFixed && <FiChevronDown className="text-muted flex-shrink-0" />}
              </button>

              {!isPatientFixed && patientOpen && (
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
                onClick={() => { if (!isDoctorFixed) { setDoctorOpen(!doctorOpen); setPatientOpen(false); } }}
                className={`w-full flex justify-between items-center border border-border rounded-lg p-3 text-sm transition ${isDoctorFixed ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-80' : 'bg-background text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
              >
                <span className="truncate">
                  {selectedDoctor?.profile?.full_name 
                    ? selectedDoctor.profile.full_name 
                    : (isDoctorFixed ? "Loading Doctor..." : "Select Doctor")}
                </span>
                {!isDoctorFixed && <FiChevronDown className="text-muted flex-shrink-0" />}
              </button>

              {!isDoctorFixed && doctorOpen && (
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

          {/* DATE FIELD - NOW A DROPDOWN */}
          <div className="relative">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Date of Appointment <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={!formData.doctorId || availableDates.length === 0}
                className="w-full border border-border rounded-lg p-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-background cursor-pointer disabled:opacity-50"
              >
                <option value="" disabled>
                  {!formData.doctorId 
                    ? "Select Doctor First" 
                    : availableDates.length === 0 
                      ? "No Available Dates Found" 
                      : "Select Available Date"}
                </option>
                {availableDates.map((item, index) => (
                  <option key={index} value={item.dateStr}>
                    {item.displayLabel}
                  </option>
                ))}
              </select>
              <FiCalendar className="absolute right-3 top-3.5 text-muted pointer-events-none" />
            </div>
          </div>

          {/* TIME FIELD */}
          <div className="relative">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Time Slot <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                disabled={availableTimes.length === 0}
                className="w-full border border-border rounded-lg p-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-background cursor-pointer disabled:opacity-50"
              >
                <option value="" disabled>
                  {availableTimes.length === 0 ? "Select Date First" : "Select Available Time Slot"}
                </option>
                {availableTimes.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <FiClock className="absolute right-3 top-3.5 text-muted pointer-events-none" />
            </div>
          </div>

          {/* Appointment Reason */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Appointment Reason <span className="text-red-500">*</span>
            </label>
            <textarea 
              name="reason" 
              value={formData.reason} 
              onChange={handleChange} 
              rows="4" 
              required 
              placeholder="Enter reason here..." 
              className="w-full border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-background placeholder:text-muted"
            ></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end items-center gap-4 border-t pt-6 border-border">
          <Link href="/admin/appointments" className="px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-hover rounded-lg transition">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading || !formData.date || !formData.time} 
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Appointment'}
          </button>
        </div>

      </form>

      {(patientOpen || doctorOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setPatientOpen(false); setDoctorOpen(false); }}></div>
      )}
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading form...</div>}>
      <AppointmentForm />
    </Suspense>
  );
}