"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Stethoscope } from "lucide-react";

import type { DoctorDashboardAppointment } from "../types";

type Props = {
  appointments: DoctorDashboardAppointment[];
};

function formatDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string) {
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

export default function DoctorUpcomingAppointments({
  appointments,
}: Props) {
  const appointment = appointments[0];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-semibold text-[#0A1B39]">
          Upcoming Appointments
        </h2>

        <Link
          href="/doctor/appointments"
          className="text-sm font-medium text-[#2E37A4] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Content */}
      <div className="p-5">
        {!appointment ? (
          <div className="flex min-h-[220px] items-center justify-center text-center">
            <div>
              <p className="text-sm font-medium text-gray-700">
                No upcoming appointments
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Your upcoming appointments will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Patient */}
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100">
                {appointment.patient.avatar_url ? (
                  <Image
                    src={appointment.patient.avatar_url}
                    alt={appointment.patient.full_name}
                    fill
                    sizes="44px"
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
                  {appointment.patient.full_name}
                </p>

                <p className="text-xs text-[#667085]">
                  ID: {appointment.patient.id.slice(0, 8)}
                </p>
              </div>
            </div>

            {/* Reason */}
            <div className="mt-5">
              <p className="text-xs text-[#667085]">Reason of Visit</p>

              <p className="mt-1 text-sm font-semibold text-[#0A1B39]">
                {appointment.reason_of_visit || "Not provided"}
              </p>
            </div>

            {/* Date & Time */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-[#2E37A4]" />

                <div>
                  <p className="text-xs text-[#667085]">Date</p>

                  <p className="text-sm font-medium text-[#0A1B39]">
                    {formatDate(appointment.appointment_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#2E37A4]" />

                <div>
                  <p className="text-xs text-[#667085]">Time</p>

                  <p className="text-sm font-medium text-[#0A1B39]">
                    {formatTime(appointment.time_slot)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <Link
              href={`/doctor/consultation/${appointment.id}`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2E37A4] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#252d89]"
            >
              <Stethoscope size={16} />
              Start Consultation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}