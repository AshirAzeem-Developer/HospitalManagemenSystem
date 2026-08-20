"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Stethoscope, X, Pencil } from "lucide-react";
import { useState } from "react";
import type { DoctorDashboardAppointment } from "../types";

type Props = {
  appointments: DoctorDashboardAppointment[];
};

function formatDate(date: string | null) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string | null) {
  if (!time) {
    return "Not available";
  }

  // Handles values such as "02:57"
  if (!time.includes("AM") && !time.includes("PM")) {
    const [hours, minutes] = time.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return time;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Handles values such as "11:30 PM"
  return time;
}

function formatStatus(status: string | null) {
  if (!status) {
    return "Unknown";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusClass(status: string | null) {
  switch (status) {
    case "confirmed":
      return "bg-green-50 text-green-700";

    case "completed":
      return "bg-blue-50 text-blue-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    case "pending":
      return "bg-yellow-50 text-yellow-700";

    default:
      return "bg-gray-50 text-gray-600";
  }
}

export default function DoctorRecentAppointments({ appointments }: Props) {
  const [sidebar, setSidebar] = useState<{
    isOpen: boolean;
    data: DoctorDashboardAppointment | null;
  }>({
    isOpen: false,
    data: null,
  });

  const openSidebar = (appointment: DoctorDashboardAppointment) => {
    setSidebar({
      isOpen: true,
      data: appointment,
    });
  };

  const closeSidebar = () => {
    setSidebar({
      isOpen: false,
      data: null,
    });
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-[#0A1B39]">
            Recent Appointments
          </h2>

          <p className="mt-1 text-xs text-[#667085]">
            Latest appointments for you
          </p>
        </div>

        <Link
          href="/doctor/appointments"
          className="text-sm font-medium text-[#2E37A4] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Empty state */}
      {appointments.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center px-5 py-8 text-center">
          <p className="text-sm text-gray-500">No recent appointments found.</p>
        </div>
      ) : (
        <>
          {/* Desktop/table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#667085]">
                    Patient
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-[#667085]">
                    Date & Time
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-[#667085]">
                    Reason
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-[#667085]">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-medium text-[#667085]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {/* Patient */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100">
                          {appointment.patient.avatar_url ? (
                            <Image
                              src={appointment.patient.avatar_url}
                              alt={appointment.patient.full_name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                              {appointment.patient.full_name
                                ?.charAt(0)
                                .toUpperCase() ?? "P"}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate text-sm font-medium text-[#0A1B39]">
                            {appointment.patient.full_name || "Unknown Patient"}
                          </p>

                          <p className="text-xs text-[#667085]">
                            ID: {appointment.patient.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#0A1B39]">
                        {formatDate(appointment.appointment_date)}
                      </p>

                      <p className="mt-1 text-xs text-[#667085]">
                        {formatTime(appointment.time_slot)}
                      </p>
                    </td>

                    {/* Reason */}
                    <td className="px-5 py-4">
                      <span className="block max-w-[200px] truncate text-sm text-[#667085]">
                        {appointment.reason_of_visit || "Not provided"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          appointment.status,
                        )}`}
                      >
                        {formatStatus(appointment.status)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openSidebar(appointment)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-[#0A1B39] transition hover:bg-gray-50"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        {appointment.status !== "completed" &&
                          appointment.status !== "cancelled" && (
                            <>
                              {appointment.prescriptionId ? (
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/doctor/prescriptions/${appointment.prescriptionId}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2E37A4] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#252d89]"
                                  >
                                    <Eye size={14} />
                                    View
                                  </Link>

                                  <Link
                                    href={`/doctor/prescriptions/${appointment.prescriptionId}/edit`}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-500"
                                  >
                                    <Pencil size={14} />
                                    Edit
                                  </Link>
                                </div>
                              ) : (
                                <Link
                                  href={`/doctor/prescriptions/create?appointmentId=${appointment.id}`}
                                  className="inline-flex items-center gap-2 rounded-lg bg-[#2E37A4] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#252d89]"
                                >
                                  <Stethoscope size={16} />
                                  Consultation
                                </Link>
                              )}
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-gray-100 md:hidden">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                    {appointment.patient.avatar_url ? (
                      <Image
                        src={appointment.patient.avatar_url}
                        alt={appointment.patient.full_name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                        {appointment.patient.full_name
                          ?.charAt(0)
                          .toUpperCase() ?? "P"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0A1B39]">
                      {appointment.patient.full_name || "Unknown Patient"}
                    </p>

                    <p className="text-xs text-[#667085]">
                      {formatDate(appointment.appointment_date)} •{" "}
                      {formatTime(appointment.time_slot)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      appointment.status,
                    )}`}
                  >
                    {formatStatus(appointment.status)}
                  </span>

                  <button
                    type="button"
                    onClick={() => openSidebar(appointment)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-[#0A1B39]"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Appointment Details Sidebar */}
      {sidebar.isOpen && sidebar.data && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <div className="relative z-10 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-semibold text-[#0A1B39]">
                Appointment Details
              </h2>

              <button
                type="button"
                onClick={closeSidebar}
                className="cursor-pointer rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-5">
                {/* Patient */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Patient Name
                  </label>

                  <p className="mt-1 text-sm font-medium text-[#0A1B39]">
                    {sidebar.data.patient?.full_name || "N/A"}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Date
                    </label>

                    <p className="mt-1 text-sm font-medium text-[#0A1B39]">
                      {formatDate(sidebar.data.appointment_date)}
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Time
                    </label>

                    <p className="mt-1 text-sm font-medium text-[#0A1B39]">
                      {formatTime(sidebar.data.time_slot)}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Reason of Visit
                  </label>

                  <p className="mt-1 break-words whitespace-pre-wrap text-sm font-medium text-[#0A1B39]">
                    {sidebar.data.reason_of_visit || "Not provided"}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </label>

                  <div className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        sidebar.data.status,
                      )}`}
                    >
                      {formatStatus(sidebar.data.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-gray-200 bg-gray-50 p-4">
              <button
                type="button"
                onClick={closeSidebar}
                className="cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
