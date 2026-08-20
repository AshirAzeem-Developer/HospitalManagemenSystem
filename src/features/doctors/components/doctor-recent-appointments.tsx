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
      return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "completed":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

    case "cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    case "pending":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    default:
      return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
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
    <section
      className="
        rounded-xl
        border border-gray-200
        bg-white
        shadow-sm

        dark:border-[#2A3850]
        dark:bg-[#0A162A]
        dark:shadow-none
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between
          border-b border-gray-200
          px-5 py-4

          dark:border-[#2A3850]
        "
      >
        <div>
          <h2
            className="
              text-lg font-semibold
              text-[#0A1B39]
              dark:text-[#F1F5F9]
            "
          >
            Recent Appointments
          </h2>

          <p
            className="
              mt-1 text-xs
              text-[#667085]
              dark:text-[#94A3B8]
            "
          >
            Latest appointments for you
          </p>
        </div>

        <Link
          href="/doctor/appointments"
          className="
            text-sm font-medium
            text-[#2E37A4]
            hover:underline
            dark:text-[#818CF8]
          "
        >
          View All
        </Link>
      </div>

      {/* Empty state */}
      {appointments.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center px-5 py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-[#94A3B8]">
            No recent appointments found.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop/table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr
                  className="
                    border-b border-gray-100
                    bg-gray-50/60

                    dark:border-[#2A3850]
                    dark:bg-[#0D1B31]
                  "
                >
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#667085] dark:text-[#94A3B8]">
                    Patient
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-[#667085] dark:text-[#94A3B8]">
                    Date & Time
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-[#667085] dark:text-[#94A3B8]">
                    Reason
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-[#667085] dark:text-[#94A3B8]">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-medium text-[#667085] dark:text-[#94A3B8]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="
                      border-b border-gray-100
                      last:border-b-0

                      dark:border-[#24344D]
                    "
                  >
                    {/* Patient */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            relative h-9 w-9 shrink-0
                            overflow-hidden rounded-full
                            bg-gray-100

                            dark:bg-[#1E293B]
                          "
                        >
                          {appointment.patient.avatar_url ? (
                            <Image
                              src={appointment.patient.avatar_url}
                              alt={appointment.patient.full_name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500 dark:text-[#94A3B8]">
                              {appointment.patient.full_name
                                ?.charAt(0)
                                .toUpperCase() ?? "P"}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              max-w-[180px]
                              truncate
                              text-sm font-medium
                              text-[#0A1B39]
                              dark:text-[#F1F5F9]
                            "
                          >
                            {appointment.patient.full_name ||
                              "Unknown Patient"}
                          </p>

                          <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
                            ID: {appointment.patient.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#0A1B39] dark:text-[#F1F5F9]">
                        {formatDate(appointment.appointment_date)}
                      </p>

                      <p className="mt-1 text-xs text-[#667085] dark:text-[#94A3B8]">
                        {formatTime(appointment.time_slot)}
                      </p>
                    </td>

                    {/* Reason */}
                    <td className="px-5 py-4">
                      <span className="block max-w-[200px] truncate text-sm text-[#667085] dark:text-[#CBD5E1]">
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
                          className="
                            inline-flex items-center gap-1.5
                            rounded-lg
                            border border-gray-200
                            px-3 py-2
                            text-xs font-medium
                            text-[#0A1B39]
                            transition
                            hover:bg-gray-50

                            dark:border-[#3A4A63]
                            dark:text-[#CBD5E1]
                            dark:hover:bg-[#18243A]
                          "
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
                                    className="
                                      inline-flex items-center gap-1.5
                                      rounded-lg
                                      bg-[#2E37A4]
                                      px-3 py-2
                                      text-xs font-medium text-white
                                      transition
                                      hover:bg-[#252d89]
                                      dark:bg-[#4F46E5]
                                      dark:hover:bg-[#4338CA]
                                    "
                                  >
                                    <Eye size={14} />
                                    View
                                  </Link>

                                  <Link
                                    href={`/doctor/prescriptions/${appointment.prescriptionId}/edit`}
                                    className="
                                      inline-flex items-center gap-1.5
                                      rounded-lg
                                      bg-amber-600
                                      px-3 py-2
                                      text-xs font-medium text-white
                                      transition
                                      hover:bg-amber-500
                                      dark:bg-amber-600
                                      dark:hover:bg-amber-500
                                    "
                                  >
                                    <Pencil size={14} />
                                    Edit
                                  </Link>
                                </div>
                              ) : (
                                <Link
                                  href={`/doctor/prescriptions/create?appointmentId=${appointment.id}`}
                                  className="
                                    inline-flex items-center gap-2
                                    rounded-lg
                                    bg-[#2E37A4]
                                    px-3 py-2
                                    text-xs font-medium text-white
                                    transition
                                    hover:bg-[#252d89]
                                    dark:bg-[#4F46E5]
                                    dark:hover:bg-[#4338CA]
                                  "
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
          <div
            className="
              divide-y divide-gray-100
              md:hidden
              dark:divide-[#24344D]
            "
          >
            {appointments.map((appointment) => (
              <div key={appointment.id} className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      relative h-10 w-10 shrink-0
                      overflow-hidden rounded-full
                      bg-gray-100

                      dark:bg-[#1E293B]
                    "
                  >
                    {appointment.patient.avatar_url ? (
                      <Image
                        src={appointment.patient.avatar_url}
                        alt={appointment.patient.full_name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500 dark:text-[#94A3B8]">
                        {appointment.patient.full_name
                          ?.charAt(0)
                          .toUpperCase() ?? "P"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0A1B39] dark:text-[#F1F5F9]">
                      {appointment.patient.full_name || "Unknown Patient"}
                    </p>

                    <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
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
                    className="
                      inline-flex items-center gap-1.5
                      rounded-lg
                      border border-gray-200
                      px-3 py-2
                      text-xs font-medium
                      text-[#0A1B39]

                      dark:border-[#3A4A63]
                      dark:text-[#CBD5E1]
                      dark:hover:bg-[#18243A]
                    "
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <div
            className="
              relative z-10
              flex h-full w-full max-w-xs
              flex-col
              bg-white
              shadow-2xl

              dark:bg-[#0A162A]
            "
          >
            {/* Header */}
            <div
              className="
                flex items-center justify-between
                border-b border-gray-200
                px-5 py-4

                dark:border-[#2A3850]
              "
            >
              <h2 className="text-base font-semibold text-[#0A1B39] dark:text-[#F1F5F9]">
                Appointment Details
              </h2>

              <button
                type="button"
                onClick={closeSidebar}
                className="
                  cursor-pointer
                  rounded-full
                  p-1.5
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-900

                  dark:text-[#94A3B8]
                  dark:hover:bg-[#18243A]
                  dark:hover:text-[#F1F5F9]
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-5">
                {/* Patient */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748B]">
                    Patient Name
                  </label>

                  <p className="mt-1 text-sm font-medium text-[#0A1B39] dark:text-[#F1F5F9]">
                    {sidebar.data.patient?.full_name || "N/A"}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748B]">
                      Date
                    </label>

                    <p className="mt-1 text-sm font-medium text-[#0A1B39] dark:text-[#F1F5F9]">
                      {formatDate(sidebar.data.appointment_date)}
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748B]">
                      Time
                    </label>

                    <p className="mt-1 text-sm font-medium text-[#0A1B39] dark:text-[#F1F5F9]">
                      {formatTime(sidebar.data.time_slot)}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748B]">
                    Reason of Visit
                  </label>

                  <p className="mt-1 break-words whitespace-pre-wrap text-sm font-medium text-[#0A1B39] dark:text-[#F1F5F9]">
                    {sidebar.data.reason_of_visit || "Not provided"}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748B]">
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
            <div
              className="
                flex justify-end
                border-t border-gray-200
                bg-gray-50
                p-4

                dark:border-[#2A3850]
                dark:bg-[#0D1B31]
              "
            >
              <button
                type="button"
                onClick={closeSidebar}
                className="
                  cursor-pointer
                  rounded-md
                  border border-gray-200
                  bg-white
                  px-3 py-1.5
                  text-xs font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-100

                  dark:border-[#3A4A63]
                  dark:bg-[#18243A]
                  dark:text-[#CBD5E1]
                  dark:hover:bg-[#22324B]
                "
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