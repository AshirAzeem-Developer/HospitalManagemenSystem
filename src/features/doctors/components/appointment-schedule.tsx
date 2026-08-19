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
  color: "#0A1B39",
};

const inputClass =
  "w-full rounded-lg px-3 py-2 text-[14px] font-normal text-[#667085] outline-none focus:border-[#4F46E5]";

const inputStyle: React.CSSProperties = {
  border: "1px solid #E7E8EB",
  fontWeight: 400,
  fontSize: "14px",
  color: "#667085",
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
    borderColor: errors[field] ? "#F87171" : "#E7E8EB",
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
          <h2 className="text-base font-semibold text-[#0A1B39] mb-6 p-2">
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
                  className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
                    selectedDay === day.value
                      ? "bg-[#2E37A4] text-white shadow-sm"
                      : "bg-[#F3F4F6] text-[#344054] hover:bg-gray-200"
                  }`}
                >
                  {day.label}

                  {hasSchedule && <span className="ml-2 text-xs">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Schedule Fields */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
            <div className={columnClass}>
              <label style={labelStyle}>Selected Day</label>

              <input
                type="text"
                readOnly
                value={
                  weekDays.find((day) => day.value === selectedDay)?.label ?? ""
                }
                className={`${inputClass} bg-gray-50 cursor-not-allowed`}
                style={inputStyle}
              />
              {errors.schedule && (
                <p className="mb-4 text-sm text-red-500">
                  {errors.schedule[0]}
                </p>
              )}
            </div>

            <div className={columnClass}>
              <label style={labelStyle}>
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
                className={`${inputClass} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
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

          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
            <div className={columnClass}>
              <label style={labelStyle}>
                Start Time
                <span className="text-red-500">*</span>
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(e) => updateSchedule("startTime", e.target.value)}
                className={inputClass}
                style={getInputStyle(`schedule.${selectedDay}.startTime`)}
              />

              {errors[`schedule.${selectedDay}.startTime`] && (
                <p className="text-xs text-red-500">
                  {errors[`schedule.${selectedDay}.startTime`][0]}
                </p>
              )}
            </div>

            <div className={columnClass}>
              <label style={labelStyle}>
                End Time
                <span className="text-red-500">*</span>
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(e) => updateSchedule("endTime", e.target.value)}
                className={inputClass}
                style={getInputStyle(`schedule.${selectedDay}.endTime`)}
              />

              {errors[`schedule.${selectedDay}.endTime`] && (
                <p className="text-xs text-red-500">
                  {errors[`schedule.${selectedDay}.endTime`][0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className={columnClass}>
              <label style={labelStyle}>
                Schedule Status
                <span className="text-red-500">*</span>
              </label>

              <select
                value={isActive ? "true" : "false"}
                onChange={(e) =>
                  updateSchedule("isActive", e.target.value === "true")
                }
                className={inputClass}
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
