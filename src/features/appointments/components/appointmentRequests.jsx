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
      <div className="p-8 text-center text-muted bg-background rounded-md border border-border">
        No pending appointments found.
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="w-full overflow-x-auto">
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
              return (
                <tr key={uniqueKey} className="hover:bg-hover transition-colors">
                  
                  {/* Date & Time Column */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{appointment.date}</div>
                    <div className="text-xs text-muted">{appointment.time}</div>
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
                          className="w-10 h-10 rounded-full object-cover bg-hover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm leading-tight">
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
                          className="w-10 h-10 rounded-full object-cover bg-hover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm leading-tight">
                          {appointment.doctorName}
                        </span>
                        <span className="text-xs text-muted font-normal mt-0.5">
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
                        className="p-1.5 text-green-600 bg-green-500/10 hover:bg-green-500/20 rounded-full transition-colors cursor-pointer"
                        title="Confirm Appointment"
                      >
                        <Check className="h-5 w-5" />
                      </button>

                      {/* Cancel Button */}
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to cancel this appointment?")) {
                            if (onCancel) onCancel(appointment.id);
                          }
                        }}
                        className="p-1.5 text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors cursor-pointer"
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