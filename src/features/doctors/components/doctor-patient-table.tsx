"use client";

import Image from "next/image";
import Link from "next/link";
import { Stethoscope } from "lucide-react";

import Table from "@/components/ui/table";
import type { DoctorPatient } from "../types";

type Props = {
  patients: DoctorPatient[];
};

function calculateAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) {
    return null;
  }

  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

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

export default function DoctorPatientTable({ patients }: Props) {
  const columns = [
    {
      key: "patient",
      label: "Patient",

      render: (patient: DoctorPatient) => (
        <div className="flex min-w-[210px] items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
            {patient.avatar_url ? (
              <Image
                src={patient.avatar_url}
                alt={patient.full_name}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                {patient.full_name?.charAt(0).toUpperCase() ?? "P"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="max-w-[170px] truncate text-sm font-semibold text-[#0A1B39]">
              {patient.full_name || "Unknown Patient"}
            </p>

            <p className="max-w-[170px] truncate text-xs text-[#667085]">
              ID: {patient.id.slice(0, 8)}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "ageGender",
      label: "Age / Gender",

      render: (patient: DoctorPatient) => {
        const age = calculateAge(patient.date_of_birth);

        return (
          <div>
            <p className="text-sm font-medium text-[#0A1B39]">
              {age !== null ? `${age} years` : "N/A"}
            </p>

            <p className="text-xs capitalize text-[#667085]">
              {patient.gender || "Not available"}
            </p>
          </div>
        );
      },
    },

    {
      key: "blood_group",
      label: "Blood Group",

      render: (patient: DoctorPatient) => (
        <span className="font-medium text-[#0A1B39]">
          {patient.blood_group || "Not available"}
        </span>
      ),
    },

    {
      key: "lastAppointment",
      label: "Last Appointment",

      render: (patient: DoctorPatient) => (
        <div>
          <p className="text-sm font-medium text-[#0A1B39]">
            {formatDate(patient.last_appointment_date)}
          </p>

          <p className="text-xs text-[#667085]">
            {formatTime(patient.last_appointment_time)}
          </p>
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",

      render: (patient: DoctorPatient) => {
        const status = patient.last_appointment_status;

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

    // {
    //   key: "actions",
    //   label: "Action",

    //   render: (patient: DoctorPatient) => (
    //       patient.last_appointment_id ? (
    //         <Link
    //           href={`/doctor/consultation/${patient.last_appointment_id}`}
    //           className="inline-flex items-center gap-2 rounded-lg bg-[#2E37A4] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#252d89]"
    //         >
    //           <Stethoscope size={15} />
    //           Consultation
    //         </Link>
    //       ) : (
    //         <span className="text-xs text-gray-400">No appointment</span>
    //       )
    //   ),
    // },
  ];

  return <Table columns={columns} data={patients} />;
}
