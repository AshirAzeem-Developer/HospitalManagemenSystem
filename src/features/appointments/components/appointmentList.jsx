"use client";

import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { Dropdown } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; 

export default function AppointmentsList({ appointments }) {
  
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
                
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    {appointment.date}
                  </div>
                  <div className="text-xs text-slate-500">
                    {appointment.time}
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  {appointment.patientName}
                </td>

                <td className="px-6 py-4">
                  {appointment.doctorName}
                </td>

                {/*  Badge  */}
                <td className="px-6 py-4 capitalize">
                  <Badge color={getBadgeColor(appointment.status)} type="light">
                    {appointment.status || "Unknown"}
                  </Badge>
                </td>

                <td className="px-6 py-4 text-right">
                  <Dropdown>
                    <Dropdown.Trigger className="rounded-full p-2 hover:bg-slate-200 outline-none transition cursor-pointer flex items-center justify-center ml-auto">
                      <MoreVertical className="h-4 w-4 text-slate-600" />
                    </Dropdown.Trigger>
                    
                    <Dropdown.Content align="right" className="w-36">
                      <Dropdown.Item onSelect={() => console.log("View", appointment.id)}>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span>View</span>
                        </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Item onSelect={() => console.log("Edit", appointment.id)}>
                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4 text-green-600" />
                          <span>Edit</span>
                        </div>
                      </Dropdown.Item>

                      <Dropdown.Item 
                        destructive={true} 
                        onSelect={() => console.log("Delete", appointment.id)}
                      >
                        <div className="flex items-center gap-2">
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
  );
}