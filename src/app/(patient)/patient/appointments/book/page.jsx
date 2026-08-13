'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiChevronLeft, FiCalendar, FiClock, FiChevronDown } from "react-icons/fi";

import { getDoctors, createAppointmentAction } from '@/features/appointments/appointmentActions/appointmentAction';

export default function PatientNewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [doctorOpen, setDoctorOpen] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    status: 'pending' 
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = await getDoctors();
        if (doctorsData) setDoctors(doctorsData);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await createAppointmentAction(formData);
    
    setLoading(false);
    if (response.success) {
      router.push('/patient/appointments'); 
    } else {
      alert("Error: " + response.message);
    }
  };

  const selectedDoctor = doctors.find(d => d.id === formData.doctorId);

  return (
    <div className="p-6 bg-background min-h-screen text-foreground transition-colors duration-200">
      
      <div className="mb-6">
        <Link href="/patient/appointments" className="flex items-center text-foreground font-bold text-lg hover:underline w-fit">
          <FiChevronLeft className="mr-1 w-5 h-5" /> Book Appointment
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-background border border-border rounded-xl p-8 shadow-sm max-w-4xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* DOCTOR SELECTION FIELD */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Select Doctor <span className="text-red-500">*</span>
            </label>
            
            <div className="relative w-full">
              <button 
                type="button" 
                onClick={() => setDoctorOpen(!doctorOpen)}
                // Yahan hover:bg-gray-200 lagaya hai taake light mode mein properly nazar aaye
                className="w-full flex justify-between items-center border border-border rounded-lg p-3 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10"
              >
                <span className="truncate">
                  {selectedDoctor?.profile?.full_name || selectedDoctor?.name || "Select Doctor"}
                </span>
                <FiChevronDown className="text-muted-foreground flex-shrink-0" />
              </button>

              {doctorOpen && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-[200px] overflow-y-auto bg-background border border-border shadow-lg rounded-lg z-50">
                  <ul className="py-1">
                    <li 
                      onClick={() => { handleDropdownSelect('doctorId', ''); setDoctorOpen(false); }}
                      // Yahan bhi hover:bg-gray-200
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer text-sm text-muted-foreground"
                    >
                      Select Doctor
                    </li>
                    {doctors.map(d => (
                      <li 
                        key={d.id} 
                        onClick={() => { handleDropdownSelect('doctorId', d.id); setDoctorOpen(false); }}
                        // Aur yahan bhi hover:bg-gray-200
                        className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer text-sm text-foreground border-b border-border last:border-0"
                      >
                        {d.profile?.full_name || d.name || "Doctor"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <input type="hidden" name="doctorId" value={formData.doctorId} required />
          </div>

          {/* DATE FIELD */}
          <div className="relative">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Date of Appointment <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
                className="w-full border border-border rounded-lg p-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-background cursor-pointer" 
              />
              <FiCalendar className="absolute right-3 top-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* TIME FIELD */}
          <div className="relative">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="time" 
                name="time" 
                value={formData.time} 
                onChange={handleChange} 
                required 
                className="w-full border border-border rounded-lg p-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-background cursor-pointer" 
              />
              <FiClock className="absolute right-3 top-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* REASON FIELD */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Reason for Appointment <span className="text-red-500">*</span>
            </label>
            <textarea 
              name="reason" 
              value={formData.reason} 
              onChange={handleChange} 
              rows="4" 
              required 
              placeholder="Describe your symptoms or reason for visit..." 
              className="w-full border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-background placeholder:text-muted-foreground"
            ></textarea>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex justify-end items-center gap-4 border-t pt-6 border-border">
          <Link href="/patient/appointments" className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-70 cursor-pointer"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>

      </form>

      {/* Background Overlay for Dropdown */}
      {doctorOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDoctorOpen(false)}></div>
      )}
    </div>
  );
}