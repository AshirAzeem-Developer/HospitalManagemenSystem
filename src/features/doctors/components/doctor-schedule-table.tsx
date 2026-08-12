"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Table from "@/components/ui/table";
import type { DoctorScheduleListItem } from "../types";

type Props = {
  doctors: DoctorScheduleListItem[];
};

const weekDays = [
  { value: 0, label: "S", name: "Sunday" },
  { value: 1, label: "M", name: "Monday" },
  { value: 2, label: "T", name: "Tuesday" },
  { value: 3, label: "W", name: "Wednesday" },
  { value: 4, label: "T", name: "Thursday" },
  { value: 5, label: "F", name: "Friday" },
  { value: 6, label: "S", name: "Saturday" },
];

function formatPhone(phone: string) {
  if (!phone) {
    return "Not available";
  }

  if (phone.startsWith("92")) {
    return `+${phone}`;
  }

  if (phone.startsWith("0")) {
    return `+92${phone.slice(1)}`;
  }

  return phone;
}

function getScheduleForDay(
  schedules: DoctorScheduleListItem["doctor_schedules"],
  day: number,
) {
  return schedules.find((schedule) => schedule.day_of_week === day);
}

export default function DoctorScheduleTable({ doctors }: Props) {
  const [search, setSearch] = useState("");

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return doctors;
    }

    return doctors.filter((doctor) => {
      // -------------------------
      // Basic doctor information
      // -------------------------

      const doctorName = (doctor.profile?.full_name ?? "").toLowerCase();

      const specialization = (doctor.specialization ?? "").toLowerCase();

      const phone = (doctor.phone ?? "").toLowerCase();

      const email = (doctor.email ?? "").toLowerCase();

      const status = (doctor.status ?? "").toLowerCase();

      // -------------------------
      // Availability information
      // -------------------------

      const hasMatchingDay = doctor.doctor_schedules.some((schedule) => {
        const day = weekDays.find((day) => day.value === schedule.day_of_week);

        return day?.name.toLowerCase().includes(query);
      });
      const hasActiveSchedule =
        query === "active" &&
        doctor.doctor_schedules.some((schedule) => schedule.is_active === true);

      const hasInactiveSchedule =
        query === "inactive" &&
        doctor.doctor_schedules.some(
          (schedule) => schedule.is_active === false,
        );

      const hasNoSchedule =
        query === "no schedule" && doctor.doctor_schedules.length === 0;

      // -------------------------
      // Normal text search
      // -------------------------

      const basicInformation = [
        doctorName,
        specialization,
        phone,
        email,
        status,
      ]
        .join(" ")
        .includes(query);

      return (
        basicInformation ||
        hasMatchingDay ||
        hasActiveSchedule ||
        hasInactiveSchedule ||
        hasNoSchedule
      );
    });
  }, [doctors, search]);
  const columns = [
    {
      key: "doctor",
      label: "Doctor",

      render: (doctor: DoctorScheduleListItem) => (
        <div className="flex min-w-[180px] items-center gap-2 sm:gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100 sm:h-11 sm:w-11">
            {doctor.profile?.avatar_url ? (
              <Image
                src={doctor.profile.avatar_url}
                alt={doctor.profile.full_name}
                fill
                sizes="(max-width: 640px) 36px, 44px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-500 sm:text-sm">
                {doctor.profile?.full_name?.charAt(0) ?? "D"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="max-w-[150px] truncate text-xs font-semibold text-[#0A1B39] sm:text-sm">
              {doctor.profile?.full_name ?? "Unknown Doctor"}
            </p>

            <p className="max-w-[150px] truncate text-xs text-[#667085] sm:text-sm">
              {doctor.specialization}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "specialization",
      label: "Department",

      render: (doctor: DoctorScheduleListItem) => (
        <span className="text-sm text-[#667085]">
          {doctor.specialization || "Not available"}
        </span>
      ),
    },

    {
      key: "phone",
      label: "Phone",

      render: (doctor: DoctorScheduleListItem) => (
        <span className="text-sm text-[#667085]">
          {formatPhone(doctor.phone)}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",

      render: (doctor: DoctorScheduleListItem) => {
        const isAvailable = doctor.status === "available";

        return (
          <Button
            variant={isAvailable ? "status-success" : "status-warning"}
            text={isAvailable ? "Available" : "On Leave"}
          />
        );
      },
    },

    {
      key: "availability",
      label: "Availability",

      render: (doctor: DoctorScheduleListItem) => (
        <div className="flex items-center gap-1.5 sm:gap-2">
          {weekDays.map((day) => {
            const schedule = getScheduleForDay(
              doctor.doctor_schedules,
              day.value,
            );

            const isActive = schedule?.is_active === true;

            return (
              <div
                key={day.value}
                title={
                  schedule
                    ? isActive
                      ? `${day.name}: Active`
                      : `${day.name}: Inactive`
                    : `${day.name}: No schedule`
                }
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium sm:h-10 sm:w-10 sm:text-sm ${
                  isActive
                    ? "bg-[#2E37A4] text-white"
                    : "bg-[#F1F3F5] text-[#0A1B39]"
                }`}
              >
                {day.label}
              </div>
            );
          })}
        </div>
      ),
    },

    {
      key: "actions",
      label: "",

      render: (doctor: DoctorScheduleListItem) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/doctors/${doctor.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-[#2E37A4] hover:bg-gray-50"
            title="View Doctor"
          >
            <Eye size={16} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-xl font-semibold text-[#0A1B39] md:text-2xl">
            Doctor Schedule
          </h1>

          <span className="rounded-md bg-[#EEF0FF] px-2.5 py-1 text-xs font-medium text-[#2E37A4] md:text-sm">
            Total Doctors : {doctors.length}
          </span>
        </div>

        {/* <button
          type="button"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[#0A1B39] shadow-sm"
        >
          Export
        </button> */}
      </div>

      {/* Search / Filters */}
      <div className="mb-5 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-[#2E37A4] sm:max-w-xs"
        />
      </div>

      {/* Search result count */}
      {search.trim() && (
        <div className="mb-3 text-sm text-gray-500">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>
      )}

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {filteredDoctors.length > 0 ? (
          <Table columns={columns} data={filteredDoctors} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-10 text-center">
            <div>
              <p className="text-sm font-medium text-gray-700">
                No doctors found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try searching with a different name, department, phone number,
                or availability day.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
