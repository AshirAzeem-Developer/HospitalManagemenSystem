"use client";

import Image from "next/image";
import Link from "next/link";
import { Stethoscope, Pencil, Eye, Trash2 } from "lucide-react";
import Table from "@/components/ui/table";
import type { DoctorAppointment } from "../types";

type Props = {
  appointments: DoctorAppointment[];
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

function formatStatus(status: string | null) {
  if (!status) {
    return "Unknown";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function DoctorAppointmentTable({ appointments }: Props) {
  const columns = [
    // Patient
    {
      key: "patient",
      label: "Patient",

      render: (appointment: DoctorAppointment) => (
        <div className="flex min-w-[210px] items-center gap-3">
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
                {appointment.patient.full_name?.charAt(0).toUpperCase() ?? "P"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="max-w-[170px] truncate text-sm font-semibold text-[#0A1B39]">
              {appointment.patient.full_name || "Unknown Patient"}
            </p>

            <p className="max-w-[170px] truncate text-xs text-[#667085]">
              ID: {appointment.patient.id.slice(0, 8)}
            </p>
          </div>
        </div>
      ),
    },

    // Date
    {
      key: "appointment_date",
      label: "Date",

      render: (appointment: DoctorAppointment) => (
        <span className="text-sm text-[#667085]">
          {formatDate(appointment.appointment_date)}
        </span>
      ),
    },

    // Time
    {
      key: "time_slot",
      label: "Time",

      render: (appointment: DoctorAppointment) => (
        <span className="text-sm text-[#667085]">
          {formatTime(appointment.time_slot)}
        </span>
      ),
    },

    // Reason
    {
      key: "reason_of_visit",
      label: "Reason",

      render: (appointment: DoctorAppointment) => (
        <span className="max-w-[220px] truncate text-sm text-[#667085]">
          {appointment.reason_of_visit || "Not provided"}
        </span>
      ),
    },

    // Status
    {
      key: "status",
      label: "Status",

      render: (appointment: DoctorAppointment) => {
        const status = appointment.status;

        const statusClass =
          status === "confirmed"
            ? "bg-green-50 text-green-700"
            : status === "completed"
              ? "bg-blue-50 text-blue-700"
              : status === "cancelled"
                ? "bg-red-50 text-red-700"
                : "bg-yellow-50 text-yellow-700";

        return (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
          >
            {formatStatus(status)}
          </span>
        );
      },
    },

    // Action
    // Action
    {
      key: "actions",
      label: "Action",

      render: (appointment: DoctorAppointment) => (
        <div className="flex min-w-max items-center gap-2">
          {/* Consultation */}
          <Link
            href={`/doctor/consultation/${appointment.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2E37A4] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#252d89]"
          >
            <Stethoscope size={16} />
            Consultation
          </Link>

          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              console.log("Edit appointment:", appointment.id);
            }}
            title="Edit appointment"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Pencil size={16} />
          </button>

          {/* View */}
          <button
            type="button"
            onClick={() => {
              console.log("View appointment:", appointment.id);
            }}
            title="View appointment"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye size={16} />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => {
              console.log("Delete appointment:", appointment.id);
            }}
            title="Delete appointment"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={appointments} />;
}