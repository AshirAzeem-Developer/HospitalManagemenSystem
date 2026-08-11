"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Trash2, X } from "lucide-react";
import { getDoctors } from "../appointmentActions/appointmentAction";

export default function PatientAppointmentList({ 
  appointments = [], 
  doctorsList = [], 
  onDelete, 
  onEdit 
}) {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [sidebar, setSidebar] = useState({
    isOpen: false,
    mode: "view", 
    data: null    
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch Doctors from Database
  useEffect(() => {
    if (doctorsList && doctorsList.length > 0) {
      setAllDoctors(doctorsList);
    } else if (allDoctors.length === 0) {
      setLoadingDoctors(true);
      getDoctors()
        .then((data) => {
          if (data && data.length > 0) setAllDoctors(data);
        })
        .catch((err) => console.error("Error fetching doctors:", err))
        .finally(() => setLoadingDoctors(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorsList?.length]);

  const availableDoctors = allDoctors.length > 0 
    ? allDoctors 
    : Array.from(new Set(appointments.map((a) => a.doctorName).filter(Boolean)));

  const openSidebar = (mode, appointmentData) => {
    setSidebar({ isOpen: true, mode: mode, data: appointmentData });
    if (mode === "edit") {
      setEditFormData(appointmentData);
    }
    setActiveDropdown(null);
  };

  const closeSidebar = () => {
    setSidebar({ isOpen: false, mode: "view", data: null });
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(editFormData); 
    }
    closeSidebar();
  };

  const getBadgeStyle = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "completed":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "pending":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "cancelled":
        return "bg-rose-100 text-rose-900 border-rose-300";
      case "confirmed":
        return "bg-blue-100 text-blue-900 border-blue-300";
      default:
        return "bg-slate-100 text-slate-900 border-slate-300";
    }
  };

  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-md border border-slate-200 shadow-sm">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="w-full min-h-[220px] overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50/50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Date & Time</th>
              <th className="px-6 py-4 font-medium">Doctor</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Prescription</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {appointments.map((appointment, index) => {
              const uniqueKey = appointment?.id ? `app-${appointment.id}` : `app-idx-${index}`;
              const isMenuOpen = activeDropdown === appointment.id;
              
              const openUpwards = (appointments.length >= 3 && index >= appointments.length - 2) || (appointments.length === 2 && index === 1);

              return (
                <tr key={uniqueKey} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{appointment.date || "N/A"}</div>
                    <div className="text-xs text-slate-500">{appointment.time || ""}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image 
                          src={appointment.doctorImage || "/default-avatar.png"} 
                          alt={appointment.doctorName || "Doctor"} 
                          width={40}
                          height={40}
                          unoptimized
                          className="w-10 h-10 rounded-full object-cover bg-slate-100"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0a1b39] text-sm leading-tight">
                          {appointment.doctorName || "Unknown Doctor"}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 capitalize">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(appointment.status)}`}>
                      {appointment.status || "Unknown"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Link 
                      href={`/prescriptions/${appointment.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-md transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-600" />
                      View
                    </Link>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => {
                          setActiveDropdown(isMenuOpen ? null : appointment.id);
                        }}
                        className="cursor-pointer rounded-full p-2 hover:bg-slate-100 text-slate-600 transition"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <div className={`absolute right-0 w-36 bg-white border border-slate-200 rounded-md shadow-lg z-50 py-1 text-left ${openUpwards ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                          <button 
                            onClick={() => openSidebar("view", appointment)}
                            className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                          >
                            <Eye className="h-3.5 w-3.5 text-blue-600" />
                            <span>View</span>
                          </button>
                          
                          <button 
                            onClick={() => openSidebar("edit", appointment)}
                            className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                          >
                            <Edit className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Edit</span>
                          </button>

                          <button 
                            onClick={() => {
                              setActiveDropdown(null);
                              if (window.confirm("Are you sure you want to delete this appointment?")) {
                                if (onDelete) onDelete(appointment.id);
                              }
                            }}
                            className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sidebar View / Edit */}
      {sidebar.isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={closeSidebar}
          ></div>
          
          <div className={`relative w-full ${sidebar.mode === "view" ? "max-w-xs" : "max-w-sm"} bg-white h-full shadow-2xl flex flex-col z-10`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
              <h2 className="text-base font-semibold text-slate-800 capitalize">
                {sidebar.mode} Appointment
              </h2>
              <button 
                onClick={closeSidebar}
                className="cursor-pointer p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 bg-white">
              {sidebar.data && (
                <div className="space-y-4">
                  
                  {/* Doctor Name - Original Native Dropdown with DB Doctors */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Doctor Name</label>
                    {sidebar.mode === "edit" ? (
                      <select 
                        name="doctorName"
                        value={editFormData.doctorName || ""}
                        onChange={handleInputChange}
                        className="cursor-pointer w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 bg-white"
                      >
                        <option value="" disabled>
                          {loadingDoctors ? "Loading doctors..." : "Select a Doctor"}
                        </option>
                        {availableDoctors.map((doc, idx) => {
                          const docName = typeof doc === 'string' 
                            ? doc 
                            : (doc.profile?.full_name || doc.name || doc.doctorName || doc.fullName || "");
                          return (
                            <option key={idx} value={docName}>{docName}</option>
                          );
                        })}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-slate-800 mt-0.5">{sidebar.data.doctorName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</label>
                      {sidebar.mode === "edit" ? (
                        <input 
                          type="date" 
                          name="date"
                          value={editFormData.date || ""}
                          onChange={handleInputChange}
                          className="w-full mt-1 px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900 bg-white"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-800 mt-0.5">{sidebar.data.date}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Time</label>
                      {sidebar.mode === "edit" ? (
                        <input 
                          type="text" 
                          name="time"
                          value={editFormData.time || ""}
                          onChange={handleInputChange}
                          className="w-full mt-1 px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900 bg-white"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-800 mt-0.5">{sidebar.data.time}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(sidebar.data.status)}`}>
                        {sidebar.data.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button 
                onClick={closeSidebar}
                className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
              >
                Close
              </button>
              {sidebar.mode === "edit" && (
                <button 
                  onClick={handleSave}
                  className="cursor-pointer px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}