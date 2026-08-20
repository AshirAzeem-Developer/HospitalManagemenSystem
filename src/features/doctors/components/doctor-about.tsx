import {
  Phone,
  Mail,
  UserRound,
  MapPin,
} from "lucide-react";

import type { DoctorDetail } from "../types";

type Props = {
  doctor: DoctorDetail;
};

function formatGender(gender: string | null) {
  if (!gender) {
    return "Not available";
  }

  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export default function DoctorAbout({ doctor }: Props) {
  const location = [
    doctor.profile.city,
    doctor.profile.state,
    doctor.profile.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0A162A] sm:p-5">
      
      {/* Heading */}
      <h2 className="text-base font-semibold text-[#0A1B39] dark:text-white sm:text-lg">
        About
      </h2>

      <div className="mt-6 space-y-10">

        {/* Phone */}
        <div className="flex items-start gap-6">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1F2FF] dark:bg-[#1A2550]">
            <Phone className="h-4 w-4 text-[#2E37A4] dark:text-[#8B92E8]" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Phone Number
            </p>

            <p className="mt-1 break-all text-sm font-normal text-slate-500 dark:text-slate-400">
              {doctor.phone || "Not available"}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-6">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1F2FF] dark:bg-[#1A2550]">
            <Mail className="h-4 w-4 text-[#2E37A4] dark:text-[#8B92E8]" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email Address
            </p>

            <p className="mt-1 break-all text-sm font-normal text-slate-500 dark:text-slate-400">
              {doctor.email || "Not available"}
            </p>
          </div>
        </div>

        {/* Gender */}
        <div className="flex items-start gap-6">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1F2FF] dark:bg-[#1A2550]">
            <UserRound className="h-4 w-4 text-[#2E37A4] dark:text-[#8B92E8]" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Gender
            </p>

            <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
              {formatGender(doctor.profile.gender)}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-6">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1F2FF] dark:bg-[#1A2550]">
            <MapPin className="h-4 w-4 text-[#2E37A4] dark:text-[#8B92E8]" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Location
            </p>

            <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
              {location || "Not available"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}