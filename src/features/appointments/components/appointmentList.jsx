"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MoreVertical, Eye, Edit, Trash2, X, ChevronDown, Check } from "lucide-react";
import { Dropdown } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; 
import { getDoctors } from "../appointmentActions/appointmentAction"; 

export default function AppointmentsList({ 
  appointments = [], 
  doctorsList = [], 
  onDelete, 
  onEdit 
}) {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false); // Custom dropdown state

  const [sidebar, setSidebar] = useState({
    isOpen: false,
    mode: "view", 
    data: null    
  });

  const [editFormData, setEditFormData] = useState({});

  // Render loop control logic
  useEffect(() => {
    if (doctorsList && doctorsList.length > 0) {
      setAllDoctors(doctorsList);
    } else if (allDoctors.length === 0) {
      setLoadingDoctors(true);
      getDoctors()
        .then((data) => {
          if (data && data.length > 0) {
            setAllDoctors(data);
          }
        })
        .catch((err) => console.error("Error fetching doctors:", err))
        .finally(() => setLoadingDoctors(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorsList?.length]);

  const openSidebar = (mode, appointmentData) => {
    setSidebar({ isOpen: true, mode: mode, data: appointmentData });
    setIsDocDropdownOpen(false);
    
    if (mode === "edit") {
      setEditFormData(appointmentData);
      if (allDoctors.length === 0) {
        setLoadingDoctors(true);
        getDoctors()
          .then((data) => {
            if (data) setAllDoctors(data);
          })
          .finally(() => setLoadingDoctors(false));
      }
    }
  };

  const closeSidebar = () => {
    setSidebar({ isOpen: false, mode: "view", data: null });
    setEditFormData({});
    setIsDocDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Custom Dropdown se doctor select karne ka handler
  const selectDoctor = (doc) => {
    const docId = doc.id || doc._id;
    const docName = doc.profile?.full_name || doc.name || doc.doctorName || "";
    
    setEditFormData((prev) => ({
      ...prev,
      doctorId: docId,
      doctorName: docName
    }));
    setIsDocDropdownOpen(false);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(editFormData); 
    } else {
      console.log("Updated Data:", editFormData);
    }
    closeSidebar();
  };

  const getBadgeColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") return "green";
    if (s === "pending") return "yellow";
    if (s === "cancelled") return "red";
    if (s === "confirmed") return "blue";
    return "light-blue"; 
  };

  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-md border">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="w-full overflow-x-auto min-h-[220px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50/50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Date & Time</th>
              <th className="px-6 py-4 font-medium">Patient</th>
              <th className="px-6 py-4 font-medium">Doctor</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {appointments.map((appointment, index) => {
              const uniqueKey = appointment?.id ? `app-${appointment.id}` : `app-idx-${index}`;
              return (
                <tr key={uniqueKey} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{appointment.date}</div>
                    <div className="text-xs text-slate-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={appointment.patientImage || "/default-avatar.png"} 
                        alt={appointment.patientName || "Patient"} 
                        width={40}
                        height={40}
                        unoptimized
                        className="w-10 h-10 rounded-full object-cover bg-slate-100"
                      />
                      <span className="font-bold text-[#0a1b39] text-sm leading-tight">
                        {appointment.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={appointment.doctorImage || "/default-avatar.png"} 
                        alt={appointment.doctorName || "Doctor"} 
                        width={40}
                        height={40}
                        unoptimized
                        className="w-10 h-10 rounded-full object-cover bg-slate-100"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0a1b39] text-sm leading-tight">
                          {appointment.doctorName}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {appointment.doctorSpecialization || "General"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <Badge color={getBadgeColor(appointment.status)} type="light">
                      {appointment.status || "Unknown"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dropdown>
                      <Dropdown.Trigger className="rounded-full p-2 hover:bg-slate-200 transition cursor-pointer ml-auto flex items-center justify-center">
                        <MoreVertical className="h-4 w-4 text-slate-600" />
                      </Dropdown.Trigger>
                      <Dropdown.Content align="right" className="w-36">
                        <Dropdown.Item className="cursor-pointer" onSelect={() => openSidebar("view", appointment)}>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-600" /><span>View</span>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item className="cursor-pointer" onSelect={() => openSidebar("edit", appointment)}>
                          <div className="flex items-center gap-2">
                            <Edit className="h-4 w-4 text-green-600" /><span>Edit</span>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item className="cursor-pointer" destructive={true} onSelect={() => {
                          if(window.confirm("Delete this appointment?")) if(onDelete) onDelete(appointment.id);
                        }}>
                          <div className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" /><span>Delete</span>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Content>
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sidebar View / Edit Drawer */}
      {sidebar.isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeSidebar}></div>
          <div className={`relative w-full ${sidebar.mode === "view" ? "max-w-xs" : "max-w-sm"} bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300`}>
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800 capitalize">{sidebar.mode} Appointment</h2>
              <button onClick={closeSidebar} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {sidebar.data && (
                <div className="space-y-5">
                  
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Patient Name</label>
                    <p className="text-sm font-medium text-slate-800 mt-1">{sidebar.data.patientName || "N/A"}</p>
                  </div>

                  {/* CUSTOM SCROLLABLE DOCTOR DROPDOWN */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Doctor</label>
                    {sidebar.mode === "edit" ? (
                      <div className="relative mt-1">
                        {/* Selector Box */}
                        <button
                          type="button"
                          onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 rounded-md bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-left cursor-pointer"
                        >
                          <span className="truncate">
                            {editFormData.doctorName || "Select a Doctor"}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDocDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Scrollable Options List */}
                        {isDocDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-100">
                            {loadingDoctors ? (
                              <div className="p-3 text-xs text-slate-500 text-center">Loading doctors...</div>
                            ) : allDoctors && allDoctors.length > 0 ? (
                              allDoctors.map((doc) => {
                                const docId = doc.id || doc._id;
                                const name = doc.profile?.full_name || doc.name || doc.doctorName || "Unknown Doctor";
                                const isSelected = String(editFormData.doctorId) === String(docId);
                                
                                return (
                                  <div
                                    key={docId}
                                    onClick={() => selectDoctor(doc)}
                                    className={`px-3 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between hover:bg-blue-50 ${
                                      isSelected ? "bg-blue-50 font-semibold text-blue-600" : "text-slate-700"
                                    }`}
                                  >
                                    <span className="truncate">{name}</span>
                                    {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-3 text-xs text-slate-500 text-center">No doctors found in Database</div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-slate-800 mt-1">{sidebar.data.doctorName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</label>
                      {sidebar.mode === "edit" ? (
                        <input 
                          type="date" 
                          name="date"
                          value={editFormData.date || ""}
                          onChange={handleInputChange}
                          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 bg-white"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-800 mt-1">{sidebar.data.date}</p>
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
                          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 bg-white"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-800 mt-1">{sidebar.data.time}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</label>
                    {sidebar.mode === "edit" ? (
                      <select 
                        name="status"
                        value={editFormData.status?.toLowerCase() || "pending"}
                        onChange={handleInputChange}
                        className="cursor-pointer w-full mt-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm capitalize text-slate-900 bg-white shadow-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <div className="mt-1">
                        <Badge color={getBadgeColor(sidebar.data.status)} type="light">
                          {sidebar.data.status || "Unknown"}
                        </Badge>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={closeSidebar} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition">
                Cancel
              </button>
              {sidebar.mode === "edit" && (
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
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