"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge"; 

// Yahan onDelete ki jagah onCancel add kiya gaya hai
export default function PendingAppointmentsList({ appointments, onCancel, onConfirm }) {
  
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
        No pending appointments found.
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="w-full overflow-x-auto">
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
                  
                  {/* Date & Time Column */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{appointment.date}</div>
                    <div className="text-xs text-slate-500">{appointment.time}</div>
                  </td>
                  
                  {/* Patient Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image 
                          src={appointment.patientImage || "/default-avatar.png"} 
                          alt={appointment.patientName || "Patient"} 
                          width={40}
                          height={40}
                          unoptimized
                          className="w-10 h-10 rounded-full object-cover bg-slate-100"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0a1b39] text-sm leading-tight">
                          {appointment.patientName}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Doctor Column */}
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
                          {appointment.doctorName}
                        </span>
                        <span className="text-xs text-slate-500 font-normal mt-0.5">
                          {appointment.doctorSpecialization || "General"}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Status Column */}
                  <td className="px-6 py-4 capitalize">
                    <Badge color={getBadgeColor(appointment.status)} type="light">
                      {appointment.status || "Unknown"}
                    </Badge>
                  </td>
                  
                  {/* Action Column */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      
                      {/* Confirm Button */}
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to approve this appointment?")) {
                            if (onConfirm) onConfirm(appointment.id);
                          }
                        }}
                        className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-full transition-colors"
                        title="Confirm Appointment"
                      >
                        <Check className="h-5 w-5" />
                      </button>

                      {/* Cancel Button (Status change to cancel instead of delete) */}
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to cancel this appointment?")) {
                            if (onCancel) onCancel(appointment.id);
                          }
                        }}
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                        title="Cancel Appointment"
                      >
                        <X className="h-5 w-5" />
                      </button>

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}