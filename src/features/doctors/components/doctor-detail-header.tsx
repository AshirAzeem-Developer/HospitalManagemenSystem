import Image from "next/image";
import { CalendarDays, Building2 } from "lucide-react";
import Link from "next/link";
import type { DoctorDetail } from "../types";

type DoctorDetailHeaderProps = {
  doctor: DoctorDetail;
};

export default function DoctorDetailHeader({
  doctor,
}: DoctorDetailHeaderProps) {
  const isAvailable = doctor.status === "available";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0A162A] sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        {/* Doctor Image */}
        <div className="relative h-28 w-28 shrink-0 self-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 sm:h-32 sm:w-32 lg:h-32 lg:w-32">
          <Image
            src={doctor.profile.avatar_url ?? "/default-doctor.png"}
            alt={doctor.profile.full_name}
            fill
            sizes="128px"
            className="object-contain"
          />
        </div>

        {/* Doctor Information */}
        <div className="min-w-0 flex-1">
          {/* Name + Specialization */}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-[#0A1B39] dark:text-white sm:text-xl">
              {doctor.profile.full_name}
            </h2>

            <span className="inline-flex items-center rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
              {doctor.specialization}
            </span>
          </div>

          {/* Qualification */}
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {doctor.qualification}
          </p>

          {/* Clinic */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />

            <span className="text-slate-500 dark:text-slate-400">
              Location:
            </span>

            <span className="font-medium text-slate-600 dark:text-slate-300">
              {[
                doctor.profile.city,
                doctor.profile.state,
                doctor.profile.country,
              ]
                .filter(Boolean)
                .join(", ") || "Not available"}
            </span>
          </div>

          {/* Status */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                isAvailable
                  ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAvailable ? "bg-green-500" : "bg-yellow-500"
                }`}
              />

              {doctor.status === "on_leave" ? "On Leave" : doctor.status}
            </span>
          </div>
        </div>

        {/* Consultation Charge */}
        <div className="border-t border-slate-100 pt-4 dark:border-slate-700 lg:min-w-[180px] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 lg:text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Consultation Charge
          </p>

          <p className="mt-1 text-xl font-semibold text-[#0A1B39] dark:text-white">
            Rs/- {doctor.consultation_fee}

            <span className="ml-1 text-sm font-normal text-slate-500 dark:text-slate-400">
              / 30 Min
            </span>
          </p>

          <Link
            
            href={`/admin/appointments/new?doctorId=${doctor.id}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2E37A4] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#252d89]"
          >
            <CalendarDays className="h-4 w-4" />
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}