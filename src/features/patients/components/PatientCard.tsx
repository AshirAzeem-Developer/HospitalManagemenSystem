
"use client";

import { CalendarDays, MapPin } from "lucide-react";

export type PatientCardData = {
  id: string;
  profile: {
    full_name: string;
    gender: string;
    avatar_url: string | null;
  } | null;
  blood_group: string;
  stay_address: string;
  last_visit: string;
};

export function PatientCard({
  patient,
}: {
  patient: PatientCardData;
}) {
  return (
    <div className="border border-slate-200 bg-white p-4">
      {/* Patient Header */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Patient Image */}
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100">
          {patient.profile?.avatar_url ? (
            <img
              src={patient.profile.avatar_url}
              alt={patient.profile.full_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
              {patient.profile?.full_name
                ?.charAt(0)
                ?.toUpperCase() || "P"}
            </div>
          )}
        </div>

        {/* Patient Info */}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {patient.profile?.full_name || "Unknown"}
          </p>

          <p className="text-xs text-slate-500">
            {patient.profile?.gender || "—"},{" "}
            {patient.blood_group || "—"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-3 border-slate-100" />

      {/* Last Visit */}
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays
            size={14}
            className="shrink-0 text-slate-400"
          />

          <span className="truncate">
            Last Visited : {patient.last_visit || "—"}
          </span>
        </p>

        {/* Address */}
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin
            size={14}
            className="shrink-0 text-slate-400"
          />

          <span className="truncate">
            {patient.stay_address || "—"}
          </span>
        </p>
      </div>
    </div>
  );
}

