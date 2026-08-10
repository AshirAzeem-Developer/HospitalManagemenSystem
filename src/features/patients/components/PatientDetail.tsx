
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Phone, Printer, Share2 } from "lucide-react";

type PatientVitals = {
  blood_pressure: string;
  heart_rate: string;
  spo2: string;
  temperature: string;
  weight: string;
};

type PatientData = {
  id: string;
  code: string;
  full_name: string;
  avatar_url: string | null;
  address: string;
  phone: string;
  last_visit: string;
  dob: string;
  blood_group: string;
  gender: string;
  email: string;
  vitals: PatientVitals;
};

function AboutRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}

export default function PatientDetail({
  patient,
}: {
  patient: PatientData;
}) {
  const [tab, setTab] = useState<
    "appointments" | "transactions"
  >("appointments");

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/patients"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft size={16} />
        Patients
      </Link>

      {/* Profile card */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Patient image */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 sm:h-20 sm:w-20">
              {patient.avatar_url ? (
                <img
                  src={patient.avatar_url}
                  alt={patient.full_name}
                  className="h-full w-full object-cover"
                  onLoad={() => {
                    console.log(
                      "IMAGE LOADED:",
                      patient.avatar_url
                    );
                  }}
                  onError={(e) => {
                    console.error(
                      "IMAGE FAILED:",
                      patient.avatar_url
                    );

                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-500">
                  {patient.full_name
                    ?.charAt(0)
                    ?.toUpperCase() || "P"}
                </div>
              )}
            </div>

            {/* Patient information */}
            <div className="min-w-0">
              <p className="text-xs text-slate-400">
                {patient.code}
              </p>

              <h2 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
                {patient.full_name}
              </h2>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Phone size={14} />
                {patient.phone}
              </p>

              <p className="text-xs text-slate-400">
                Last Visited: {patient.last_visit}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              >
                <Phone size={16} />
              </button>

              <button
                type="button"
                className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              >
                <Printer size={16} />
              </button>

              <button
                type="button"
                className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              >
                <Share2 size={16} />
              </button>
            </div>

            <button
              type="button"
              className="w-full rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 sm:w-auto"
            >
              + Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* About + Vitals */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* About */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            About
          </h3>

          <AboutRow
            label="DOB"
            value={patient.dob}
          />

          <AboutRow
            label="Blood Group"
            value={patient.blood_group}
          />

          <AboutRow
            label="Gender"
            value={patient.gender}
          />

          <AboutRow
            label="Email"
            value={patient.email}
          />

          <AboutRow
            label="Address"
            value={patient.address}
          />
        </div>

        {/* Vital Signs */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Vital Signs
          </h3>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <AboutRow
              label="Blood Pressure"
              value={patient.vitals.blood_pressure}
            />

            <AboutRow
              label="Heart Rate"
              value={patient.vitals.heart_rate}
            />

            <AboutRow
              label="SPO2"
              value={patient.vitals.spo2}
            />

            <AboutRow
              label="Temperature"
              value={patient.vitals.temperature}
            />

            <AboutRow
              label="Weight"
              value={patient.vitals.weight}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-6 border-b border-slate-200 px-4 pt-4 sm:px-6">
          {(
            ["appointments", "transactions"] as const
          ).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 pb-3 text-sm font-medium capitalize ${
                tab === t
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Appointments */}
        {tab === "appointments" && (
          <div className="p-6 text-sm text-slate-500">
            No appointments yet.
          </div>
        )}

        {/* Transactions */}
        {tab === "transactions" && (
          <div className="p-6 text-sm text-slate-500">
            No transactions yet.
          </div>
        )}
      </div>
    </div>
  );
}

