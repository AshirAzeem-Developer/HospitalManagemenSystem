"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import {
  ChevronLeft,
  Phone,
  CalendarDays,
  Droplet,
  User,
  Mail,
  HeartPulse,
  Percent,
  Thermometer,
  Weight,
  UserRound,
  BookOpen,
} from "lucide-react";
import BillingTable from "@/features/billing/component/billing-table";
import AppointmentsContainer from "@/features/appointments/components/AppointmentsContainer";

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

function InfoCell({
  icon,
  label,
  value,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status?: "normal" | "alert";
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[13px] font-semibold leading-[21px] text-slate-900 dark:text-white">
          {label}
        </p>

        <p className="flex items-center gap-1.5 truncate text-[13px] font-normal leading-[19.5px] text-slate-500 dark:text-gray-400">
          {status && (
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                status === "alert"
                  ? "bg-red-500"
                  : "bg-emerald-500"
              }`}
            />
          )}
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
        {icon}
        <h5 className="text-sm font-semibold">{title}</h5>
      </div>

      {action}
    </div>
  );
}

export default function PatientDetail({
  patient,
  invoices = [],
  appointments = [],
  doctors = [],
}: {
  patient: PatientData;
  invoices?: any[];
  appointments?: any[];
  doctors?: any[];
}) {
  const router = useRouter();

  const [tab, setTab] = useState<
    "appointments" | "transactions"
  >("appointments");

  return (
    <div className="min-h-screen space-y-6 bg-[#F5F6F8] p-6 -m-6 dark:bg-gray-950">
      {/* Back link */}
      <Link
        href="/admin/patients"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-400"
      >
        <ChevronLeft size={18} />
        Patients
      </Link>

      {/* Profile card */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Decorative vectors */}
        <img
          src="/images/Vector 7.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[70px] top-0 z-0 hidden h-[140px] w-auto lg:block lg:right-[200px] lg:h-[180px]"
        />

        <img
          src="/images/Vector 8.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-50 top-0 z-0 hidden h-[180px] w-auto lg:block lg:h-[230px]"
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Patient image */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-gray-800 sm:h-20 sm:w-20">
              {patient.avatar_url ? (
                <img
                  src={patient.avatar_url}
                  alt={patient.full_name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-500 dark:text-gray-400">
                  {patient.full_name?.charAt(0)?.toUpperCase() || "P"}
                </div>
              )}
            </div>

            {/* Patient information */}
            <div className="min-w-0">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                #{patient.code}
              </p>

              <h2 className="truncate text-[20px] font-semibold leading-[30px] text-slate-900 dark:text-white">
                {patient.full_name}
              </h2>

              <p className="truncate text-[13px] font-normal leading-[19.5px] text-slate-500 dark:text-gray-400">
                {patient.address}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-normal leading-[19.5px] text-slate-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Phone size={14} />
                  Phone : {patient.phone}
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Last Visited : {patient.last_visit}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="relative flex items-center gap-2 sm:flex-col sm:items-end">
            <Button
              type="button"
              variant="primary"
              text="Book Appointment"
              icon={<CalendarDays size={16} />}
              onClick={() => {
                router.push("/admin/appointments/new");
              }}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* About + Vitals */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* About */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-900">
          <SectionHeader
            icon={<UserRound size={16} />}
            title="About"
          />

          <hr className="-mx-4 mb-5 border-slate-200 dark:border-gray-700 sm:-mx-6" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCell
              icon={<CalendarDays size={18} />}
              label="DOB"
              value={patient.dob}
            />

            <InfoCell
              icon={<Droplet size={18} />}
              label="Blood Group"
              value={patient.blood_group}
            />

            <InfoCell
              icon={<User size={18} />}
              label="Gender"
              value={patient.gender}
            />

            <InfoCell
              icon={<Mail size={18} />}
              label="Email"
              value={patient.email}
            />
          </div>
        </div>

        {/* Vital Signs */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-900">
          <SectionHeader
            icon={<BookOpen size={16} />}
            title="Vital Signs"
          />

          <hr className="-mx-4 mb-5 border-slate-200 dark:border-gray-700 sm:-mx-6" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoCell
              icon={<Droplet size={18} />}
              label="Blood Pressure"
              value={patient.vitals.blood_pressure}
              status="normal"
            />

            <InfoCell
              icon={<HeartPulse size={18} />}
              label="Heart Rate"
              value={patient.vitals.heart_rate}
              status="alert"
            />

            <InfoCell
              icon={<Percent size={18} />}
              label="SPO2"
              value={patient.vitals.spo2}
              status="normal"
            />

            <InfoCell
              icon={<Thermometer size={18} />}
              label="Temperature"
              value={patient.vitals.temperature}
              status="normal"
            />

            <InfoCell
              icon={<Weight size={18} />}
              label="Weight"
              value={patient.vitals.weight}
              status="normal"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 pt-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-6">
            {(
              ["appointments", "transactions"] as const
            ).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`border-b-2 pb-3 text-sm font-medium capitalize ${
                  tab === t
                    ? "border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-4 sm:p-6">
          {tab === "appointments" && (
            <AppointmentsContainer
              initialAppointments={appointments as any}
              doctorsList={doctors as any}
              showNewButton={false}
            />
          )}

          {tab === "transactions" && (
            <BillingTable invoices={invoices} />
          )}
        </div>
      </div>
    </div>
  );
}