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

  const [sidebar, setSidebar] = useState({
    isOpen: false,
    mode: "view", 
    data: null  
  });

  const [editFormData, setEditFormData] = useState({});

  const todayStr = new Date().toISOString().split('T')[0];

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
  }, [doctorsList?.length]);

  const openSidebar = (mode, appointmentData) => {
    if (mode === "edit" && appointmentData?.status?.toLowerCase() === "completed") {
      mode = "view";
    }

    setSidebar({ isOpen: true, mode: mode, data: appointmentData });
    
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "date" && value && value < todayStr) {
      return;
    }

    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectDoctor = (doc) => {
    const docId = doc.id || doc._id;
    const docName = doc.profile?.full_name || doc.name || doc.doctorName || "";
    
    setEditFormData((prev) => ({
      ...prev,
      doctorId: docId,
      doctorName: docName
    }));
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(editFormData); 
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
      <div className="p-8 text-center text-muted bg-background rounded-md border border-border">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="w-full relative">
      
      <div className="w-full overflow-x-auto pb-2">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="border-b border-border bg-hover/50 text-muted">
            <tr>
              <th className="px-6 py-4 font-medium">Date & Time</th>
              <th className="px-6 py-4 font-medium">Patient</th>
              <th className="px-6 py-4 font-medium">Doctor</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.map((appointment, index) => {
              const uniqueKey = appointment?.id ? `app-${appointment.id}` : `app-idx-${index}`;
              const isCompleted = appointment.status?.toLowerCase() === "completed";

              return (
                <tr key={uniqueKey} className="hover:bg-hover transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{appointment.date}</div>
                    <div className="text-xs text-muted">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={appointment.patientImage || "/default-avatar.png"} 
                        alt={appointment.patientName || "Patient"} 
                        width={40}
                        height={40}
                        unoptimized
                        className="w-10 h-10 rounded-full object-cover bg-hover"
                      />
                      <span className="font-bold text-foreground text-sm leading-tight">
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
                        className="w-10 h-10 rounded-full object-cover bg-hover"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm leading-tight">
                          {appointment.doctorName}
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
                      <Dropdown.Trigger className="rounded-full p-2 hover:bg-hover transition cursor-pointer ml-auto flex items-center justify-center">
                        <MoreVertical className="h-4 w-4 text-muted" />
                      </Dropdown.Trigger>
                      <Dropdown.Content align="right" className="w-36 bg-background border border-border">
                        <Dropdown.Item className="cursor-pointer hover:bg-hover" onSelect={() => openSidebar("view", appointment)}>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-500" />
                            <span className="text-foreground">View</span>
                          </div>
                        </Dropdown.Item>
                        
                        {!isCompleted && (
                          <Dropdown.Item className="cursor-pointer hover:bg-hover" onSelect={() => openSidebar("edit", appointment)}>
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4 text-green-500" />
                              <span className="text-foreground">Edit</span>
                            </div>
                          </Dropdown.Item>
                        )}

                        <Dropdown.Item className="cursor-pointer hover:bg-hover" destructive={true} onSelect={() => {
                          if(window.confirm("Delete this appointment?")) if(onDelete) onDelete(appointment.id);
                        }}>
                          <div className="flex items-center gap-2 text-red-500">
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={closeSidebar}></div>
          <div className={`relative w-full ${sidebar.mode === "view" ? "max-w-xs" : "max-w-sm"} bg-background h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-border`}>
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground capitalize">{sidebar.mode} Appointment</h2>
              <button onClick={closeSidebar} className="p-1.5 text-muted hover:bg-hover rounded-full transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {sidebar.data && (
                <div className="space-y-5">
                  
                  <div>
                    <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Patient Name</label>
                    <p className="text-sm font-medium text-foreground mt-1">{sidebar.data.patientName || "N/A"}</p>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Doctor</label>
                    {sidebar.mode === "edit" ? (
                      <div className="mt-1 [&>div]:w-full">
                        <Dropdown>
                          <Dropdown.Trigger className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-md bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-left cursor-pointer">
                            <span className="truncate">
                              {editFormData.doctorName || "Select a Doctor"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                          </Dropdown.Trigger>
                          
                          <Dropdown.Content className="w-full max-h-48 overflow-y-auto divide-y divide-border bg-background">
                            {loadingDoctors ? (
                              <div className="p-3 text-xs text-muted text-center">Loading doctors...</div>
                            ) : allDoctors && allDoctors.length > 0 ? (
                              allDoctors.map((doc) => {
                                const docId = doc.id || doc._id;
                                const name = doc.profile?.full_name || doc.name || doc.doctorName || "Unknown Doctor";
                                const isSelected = String(editFormData.doctorId) === String(docId);
                                
                                return (
                                  <Dropdown.Item 
                                    key={docId}
                                    onSelect={() => selectDoctor(doc)}
                                    className={`px-3 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between hover:bg-hover ${
                                      isSelected ? "bg-hover font-semibold text-foreground" : "text-foreground"
                                    }`}
                                  >
                                    <span className="truncate">{name}</span>
                                    {isSelected && <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                                  </Dropdown.Item>
                                );
                              })
                            ) : (
                              <div className="p-3 text-xs text-muted text-center">No doctors found in Database</div>
                            )}
                          </Dropdown.Content>
                        </Dropdown>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-foreground mt-1">{sidebar.data.doctorName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Date</label>
                      {sidebar.mode === "edit" ? (
                        <input 
                          type="date" 
                          name="date"
                          value={editFormData.date || ""}
                          onChange={handleInputChange}
                          onKeyDown={(e) => e.preventDefault()}
                          min={todayStr}
                          className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-foreground bg-background"
                        />
                      ) : (
                        <p className="text-sm font-medium text-foreground mt-1">{sidebar.data.date}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Time</label>
                      {sidebar.mode === "edit" ? (
                        <input 
                          type="text" 
                          name="time"
                          value={editFormData.time || ""}
                          onChange={handleInputChange}
                          className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-foreground bg-background"
                        />
                      ) : (
                        <p className="text-sm font-medium text-foreground mt-1">{sidebar.data.time}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Status</label>
                    {sidebar.mode === "edit" ? (
                      <select 
                        name="status"
                        value={editFormData.status?.toLowerCase() || "pending"}
                        onChange={handleInputChange}
                        className="cursor-pointer w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm capitalize text-foreground bg-background shadow-sm"
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

                  {sidebar.mode === "view" && (
                    <div>
                      <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                        Reason of Visit
                      </label>
                      <div className="mt-1.5 border-l-2 border-blue-500/40 dark:border-blue-400/40 pl-3 py-0.5">
                        <p className="text-sm text-foreground/90 leading-relaxed">
                          {sidebar.data.reason ? (
                            sidebar.data.reason
                          ) : (
                            <span className="text-muted italic text-xs">No reason provided</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2 bg-background">
              <button onClick={closeSidebar} className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-hover transition cursor-pointer">
                Cancel
              </button>
              {sidebar.mode === "edit" && (
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition cursor-pointer">
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