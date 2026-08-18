"use client";

import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";

import type { DoctorTopPatient } from "../types";

type Props = {
  patients: DoctorTopPatient[];
};

export default function DoctorTopPatients({ patients }: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-[#0A1B39]">
            Top Patients
          </h2>

          <p className="mt-1 text-xs text-[#667085]">
            Patients with the most appointments
          </p>
        </div>

        <Link
          href="/doctor/patients"
          className="text-sm font-medium text-[#2E37A4] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Empty state */}
      {patients.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center px-5 py-8 text-center">
          <div>
            <Users className="mx-auto mb-2 text-gray-400" size={28} />

            <p className="text-sm font-medium text-gray-700">
              No patients found
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Patients with appointments will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              {/* Patient information */}
              <div className="flex min-w-0 items-center gap-3">
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
                  <p className="truncate text-sm font-semibold text-[#0A1B39]">
                    {patient.full_name || "Unknown Patient"}
                  </p>

                  <p className="truncate text-xs text-[#667085]">
                    ID: {patient.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              {/* Appointment count */}
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-[#0A1B39]">
                  {patient.appointmentCount}
                </p>

                <p className="text-xs text-[#667085]">
                  {patient.appointmentCount === 1
                    ? "Appointment"
                    : "Appointments"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}