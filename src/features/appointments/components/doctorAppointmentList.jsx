"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreVertical, Eye, Pencil, Plus, X } from "lucide-react";

export default function DoctorAppointmentList({ appointments = [] }) {
  const [sidebar, setSidebar] = useState({
    isOpen: false,
    data: null,
  });

  const [activeDropdown, setActiveDropdown] = useState(null);

  const openSidebar = (appointmentData) => {
    setSidebar({ isOpen: true, data: appointmentData });
    setActiveDropdown(null);
  };

  const closeSidebar = () => {
    setSidebar({ isOpen: false, data: null });
  };

  const getBadgeStyle = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "completed":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      case "cancelled":
        return "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
      case "confirmed":
        return "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-muted/10 text-muted border-border";
    }
  };

  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-8 text-center text-muted bg-card rounded-md border border-border shadow-sm">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="w-full min-h-[220px] overflow-x-auto bg-card rounded-lg border border-border shadow-sm">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="border-b border-border bg-hover/50 text-muted">
            <tr>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Date & Time</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Patient</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Prescription</th>
              <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.map((appointment, index) => {
              const uniqueKey = appointment?.id
                ? `app-${appointment.id}`
                : `app-idx-${index}`;
              const isMenuOpen = activeDropdown === appointment.id;

              const openUpwards =
                (appointments.length >= 3 &&
                  index >= appointments.length - 2) ||
                (appointments.length === 2 && index === 1);

              return (
                <tr
                  key={uniqueKey}
                  className="hover:bg-hover/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {appointment.date || "N/A"}
                    </div>
                    <div className="text-xs text-muted">
                      {appointment.time || ""}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={
                            appointment.patientImage || "/default-avatar.png"
                          }
                          alt={appointment.patientName || "Patient"}
                          width={40}
                          height={40}
                          unoptimized
                          className="w-10 h-10 rounded-full object-cover bg-hover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm leading-tight">
                          {appointment.patientName || "Unknown Patient"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 capitalize">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(appointment.status)}`}
                    >
                      {appointment.status || "Unknown"}
                    </span>
                  </td>

                  {/* Prescription: View+Edit if one exists, Create if not.
                      Plain inline buttons rather than a second dropdown —
                      at most two actions doesn't need a menu, and it removes
                      a second floating panel that could visually clash with
                      the Action column's dropdown. */}
                  <td className="px-6 py-4">
                    {appointment.prescriptionId ? (
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/doctor/prescriptions/${appointment.prescriptionId}`}
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-card border border-border hover:bg-hover rounded-md transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          View
                        </Link>
                        <Link
                          href={`/doctor/prescriptions/${appointment.prescriptionId}/edit`}
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-card border border-border hover:bg-hover rounded-md transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          Edit
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={`/doctor/prescriptions/create?appointmentId=${appointment.id}`}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-card border border-border hover:bg-hover rounded-md transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        Create Prescription
                      </Link>
                    )}
                  </td>

                  {/* Action Column: 3 dots menu, appointment details sidebar only */}
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() =>
                          setActiveDropdown(isMenuOpen ? null : appointment.id)
                        }
                        className="cursor-pointer rounded-full p-2 hover:bg-hover text-muted transition"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <div
                          className={`absolute right-0 w-32 bg-card border border-border rounded-md shadow-lg z-50 py-1 text-left ${openUpwards ? "bottom-full mb-1" : "top-full mt-1"}`}
                        >
                          <button
                            onClick={() => openSidebar(appointment)}
                            className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-hover transition"
                          >
                            <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            <span>View Details</span>
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

      {/* Sidebar - View Details */}
      {sidebar.isOpen && sidebar.data && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeSidebar}
          ></div>

          <div className="relative w-full max-w-xs bg-card h-full shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
              <h2 className="text-base font-semibold text-foreground">
                Appointment Details
              </h2>
              <button
                onClick={closeSidebar}
                className="cursor-pointer p-1.5 text-muted hover:text-foreground hover:bg-hover rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 bg-card">
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    Patient Name
                  </label>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {sidebar.data.patientName || "N/A"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                      Date
                    </label>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {sidebar.data.date || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                      Time
                    </label>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {sidebar.data.time || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(sidebar.data.status)}`}
                    >
                      {sidebar.data.status || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end bg-hover/30">
              <button
                onClick={closeSidebar}
                className="cursor-pointer px-3 py-1.5 text-xs font-medium text-muted bg-card border border-border rounded-md hover:bg-hover transition"
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
