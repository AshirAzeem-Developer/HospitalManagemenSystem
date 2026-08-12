"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MoreVertical,
  Eye,
  X,
  ChevronDown,
  FileText,
  Plus,
} from "lucide-react";
import { Dropdown } from "@/components/ui/select";

export default function DoctorAppointmentList({ appointments = [] }) {
  const [sidebar, setSidebar] = useState({
    isOpen: false,
    data: null,
  });

  const openSidebar = (appointmentData) => {
    setSidebar({ isOpen: true, data: appointmentData });
  };

  const closeSidebar = () => {
    setSidebar({ isOpen: false, data: null });
  };

  const getBadgeStyle = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium text-sm">No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="w-full min-h-[300px] pb-28 overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Date & Time</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Patient</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Prescription</th>
              <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((appointment, index) => {
              const uniqueKey = appointment?.id ? `app-${appointment.id}` : `app-idx-${index}`;

              return (
                <tr key={uniqueKey} className="hover:bg-slate-50/80 transition-colors">
                  {/* Date & Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{appointment.date || "N/A"}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{appointment.time || ""}</div>
                  </td>

                  {/* Patient Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0 rounded-full ring-2 ring-white shadow-sm">
                        <Image
                          src={appointment.patientImage || "/default-avatar.png"}
                          alt={appointment.patientName || "Patient"}
                          width={40}
                          height={40}
                          unoptimized
                          className="w-full h-full rounded-full object-cover bg-slate-100"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm">
                          {appointment.patientName || "Unknown Patient"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 capitalize whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getBadgeStyle(appointment.status)}`}>
                      {appointment.status || "Unknown"}
                    </span>
                  </td>

                  {/* Prescription Section */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Dropdown>
                      <Dropdown.Trigger className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-slate-100">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span>Prescription</span>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform" />
                      </Dropdown.Trigger>

                      <Dropdown.Content align="left" className="w-60 p-1.5 rounded-xl border border-slate-100 bg-white shadow-lg ring-1 ring-black/5">
                        {/* New Prescription */}
                        <Link href={`/prescriptions/new/${appointment.id}`} className="block outline-none">
                          <Dropdown.Item className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 text-emerald-600">
                                <Plus className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">
                                  New Prescription
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Create a new document
                                </span>
                              </div>
                            </div>
                          </Dropdown.Item>
                        </Link>

                        {/* View Prescription */}
                        <Link href={`/prescriptions/${appointment.id}`} className="block outline-none mt-1">
                          <Dropdown.Item className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600">
                                <Eye className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">
                                  View Details
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Check existing records
                                </span>
                              </div>
                            </div>
                          </Dropdown.Item>
                        </Link>
                      </Dropdown.Content>
                    </Dropdown>
                  </td>

                  {/* Action Dropdown */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Dropdown>
                      <Dropdown.Trigger className="rounded-md p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer ml-auto flex items-center justify-center outline-none">
                        <MoreVertical className="h-4 w-4" />
                      </Dropdown.Trigger>
                      <Dropdown.Content align="right" className="w-36 p-1 rounded-lg border-slate-100 shadow-lg">
                        <Dropdown.Item
                          className="cursor-pointer px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
                          onSelect={() => openSidebar(appointment)}
                        >
                          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                            <Eye className="h-4 w-4 text-slate-400" />
                            <span>View</span>
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

      {/* Sidebar - View Details */}
      {sidebar.isOpen && sidebar.data && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeSidebar}
          ></div>

          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
              <h2 className="text-lg font-semibold text-slate-900">
                Appointment Details
              </h2>
              <button
                onClick={closeSidebar}
                className="cursor-pointer p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Patient Name
                </label>
                <p className="text-base font-medium text-slate-900 mt-1">
                  {sidebar.data.patientName || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Date
                  </label>
                  <p className="text-base font-medium text-slate-900 mt-1">
                    {sidebar.data.date || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Time
                  </label>
                  <p className="text-base font-medium text-slate-900 mt-1">
                    {sidebar.data.time || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </label>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(
                      sidebar.data.status
                    )}`}
                  >
                    {sidebar.data.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={closeSidebar}
                className="cursor-pointer px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}