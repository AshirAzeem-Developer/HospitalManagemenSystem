"use client";

import { useState } from "react";
import type { DoctorSchedule } from "../types";

type Props = {
  schedules: DoctorSchedule[];
  setSchedules: React.Dispatch<React.SetStateAction<DoctorSchedule[]>>;
  errors: Record<string, string[]>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
};

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "21px",
  letterSpacing: "0%",
};

const inputClass =
  "w-full rounded-lg border border-[#E7E8EB] bg-white px-3 py-2 text-[14px] font-normal text-[#667085] outline-none placeholder:text-[#98A2B3] focus:border-[#4F46E5] dark:border-gray-700 dark:bg-[#111F33] dark:text-gray-200 dark:placeholder:text-gray-500";

const inputStyle: React.CSSProperties = {
  fontWeight: 400,
  fontSize: "14px",
};

const columnClass = "flex flex-col gap-2";

const weekDays = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function AppointmentSchedule({
  schedules,
  setSchedules,
  errors,
  setErrors,
}: Props) {
  const [selectedDay, setSelectedDay] = useState(1);

  const currentSchedule = schedules.find(
    (schedule) => schedule.dayOfWeek === selectedDay,
  );

  const startTime = currentSchedule?.startTime ?? "";
  const endTime = currentSchedule?.endTime ?? "";
  const slotDuration = currentSchedule?.slotDurationMinutes ?? "";
  const isActive = currentSchedule?.isActive ?? true;

  const getInputStyle = (field: string): React.CSSProperties => ({
    ...inputStyle,
    ...(errors[field] && {
      borderColor: "#F87171",
    }),
  });

  const clearScheduleError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;

      const next = { ...prev };
      delete next[field];

      return next;
    });
  };

  const updateSchedule = (
    field: keyof DoctorSchedule,
    value: string | number | boolean,
  ) => {
    setSchedules((prev) => {
      const existing = prev.find(
        (schedule) => schedule.dayOfWeek === selectedDay,
      );

      if (existing) {
        return prev.map((schedule) =>
          schedule.dayOfWeek === selectedDay
            ? {
                ...schedule,
                [field]: value,
              }
            : schedule,
        );
      }

      return [
        ...prev,
        {
          dayOfWeek: selectedDay,
          startTime: "",
          endTime: "",
          slotDurationMinutes: 30,
          isActive: true,
          [field]: value,
        },
      ];
    });

    clearScheduleError(`schedule.${selectedDay}.${field}`);
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <h2
            className="
              mb-6 p-2 text-base font-semibold
              text-[#0A1B39]
              dark:text-gray-100
            "
          >
            Appointment Schedule
          </h2>

          {/* Week Days */}
          <div className="mb-8 flex flex-wrap gap-3">
            {weekDays.map((day) => {
              const hasSchedule = schedules.some(
                (schedule) => schedule.dayOfWeek === day.value,
              );

              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setSelectedDay(day.value)}
                  className={`
                    rounded-lg px-5 py-2 text-sm font-medium
                    transition-all

                    ${
                      selectedDay === day.value
                        ? "bg-[#2E37A4] text-white shadow-sm"
                        : `
                          bg-[#F3F4F6] text-[#344054]
                          hover:bg-gray-200

                          dark:bg-[#16243A]
                          dark:text-gray-300
                          dark:hover:bg-[#1D2D45]
                        `
                    }
                  `}
                >
                  {day.label}

                  {hasSchedule && <span className="ml-2 text-xs">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Schedule Fields */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Selected Day */}
            <div className={columnClass}>
              <label
                className="
                  text-sm font-medium
                  text-[#0A1B39]
                  dark:text-gray-200
                "
              >
                Selected Day
              </label>

              <input
                type="text"
                readOnly
                value={
                  weekDays.find((day) => day.value === selectedDay)?.label ?? ""
                }
                className={`
  ${inputClass}
  cursor-not-allowed
  bg-gray-50
  dark:bg-[#16243A]
  dark:text-gray-400
`}
                style={inputStyle}
              />

              {errors.schedule && (
                <p className="mb-4 text-sm text-red-500">
                  {errors.schedule[0]}
                </p>
              )}
            </div>

            {/* Slot Duration */}
            <div className={columnClass}>
              <label
                className="
                  text-sm font-medium
                  text-[#0A1B39]
                  dark:text-gray-200
                "
              >
                Slot Duration (Minutes)
                <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                min="1"
                value={slotDuration}
                onChange={(e) =>
                  updateSchedule(
                    "slotDurationMinutes",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="30"
                className={`
                  ${inputClass}
                  [&::-webkit-inner-spin-button]:appearance-none
                  [&::-webkit-outer-spin-button]:appearance-none

                  placeholder:text-[#98A2B3]
                  dark:placeholder:text-gray-500
                `}
                style={getInputStyle(
                  `schedule.${selectedDay}.slotDurationMinutes`,
                )}
              />

              {errors[`schedule.${selectedDay}.slotDurationMinutes`] && (
                <p className="text-xs text-red-500">
                  {errors[`schedule.${selectedDay}.slotDurationMinutes`][0]}
                </p>
              )}
            </div>
          </div>

          {/* Start / End Time */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Start Time */}
            <div className={columnClass}>
              <label
                className="
                  text-sm font-medium
                  text-[#0A1B39]
                  dark:text-gray-200
                "
              >
                Start Time
                <span className="text-red-500">*</span>
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(e) => updateSchedule("startTime", e.target.value)}
                className={`${inputClass} dark:[color-scheme:dark]`}
                style={getInputStyle(`schedule.${selectedDay}.startTime`)}
              />

              {errors[`schedule.${selectedDay}.startTime`] && (
                <p className="text-xs text-red-500">
                  {errors[`schedule.${selectedDay}.startTime`][0]}
                </p>
              )}
            </div>

            {/* End Time */}
            <div className={columnClass}>
              <label
                className="
                  text-sm font-medium
                  text-[#0A1B39]
                  dark:text-gray-200
                "
              >
                End Time
                <span className="text-red-500">*</span>
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(e) => updateSchedule("endTime", e.target.value)}
                className={`${inputClass} dark:[color-scheme:dark]`}
                style={getInputStyle(`schedule.${selectedDay}.endTime`)}
              />

              {errors[`schedule.${selectedDay}.endTime`] && (
                <p className="text-xs text-red-500">
                  {errors[`schedule.${selectedDay}.endTime`][0]}
                </p>
              )}
            </div>
          </div>

          {/* Schedule Status */}
          <div className="grid grid-cols-2 gap-6">
            <div className={columnClass}>
              <label
                className="
                  text-sm font-medium
                  text-[#0A1B39]
                  dark:text-gray-200
                "
              >
                Schedule Status
                <span className="text-red-500">*</span>
              </label>

              <select
                value={isActive ? "true" : "false"}
                onChange={(e) =>
                  updateSchedule("isActive", e.target.value === "true")
                }
                className={`
                  ${inputClass}
                  dark:border-gray-700
                `}
                style={inputStyle}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
