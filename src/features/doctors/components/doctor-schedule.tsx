"use client";

import type { DashboardDoctorSchedule } from "../types";

type Props = {
  schedules: DashboardDoctorSchedule[];
};

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

export default function DoctorSchedule({ schedules }: Props) {
  return (
    <section
      className="
        rounded-xl
        border border-gray-200
        bg-white
        shadow-sm

        dark:border-[#2A3850]
        dark:bg-[#0A162A]
        dark:shadow-none
      "
    >
      {/* Header */}
      <div
        className="
          border-b border-gray-200
          px-5 py-4

          dark:border-[#2A3850]
        "
      >
        <h2
          className="
            text-lg font-semibold
            text-[#0A1B39]
            dark:text-[#F1F5F9]
          "
        >
          My Schedule
        </h2>

        <p
          className="
            mt-1 text-xs
            text-[#667085]
            dark:text-[#94A3B8]
          "
        >
          Your available consultation hours
        </p>
      </div>

      {/* Empty state */}
      {schedules.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center px-5 py-8 text-center">
          <p
            className="
              text-sm
              text-gray-500
              dark:text-[#94A3B8]
            "
          >
            No schedule available.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr
                className="
                  border-b border-gray-100
                  bg-gray-50/60

                  dark:border-[#2A3850]
                  dark:bg-[#0D1B31]
                "
              >
                <th
                  className="
                    px-5 py-3
                    text-left text-xs font-medium
                    text-[#667085]
                    dark:text-[#94A3B8]
                  "
                >
                  Day
                </th>

                <th
                  className="
                    px-5 py-3
                    text-left text-xs font-medium
                    text-[#667085]
                    dark:text-[#94A3B8]
                  "
                >
                  Start Time
                </th>

                <th
                  className="
                    px-5 py-3
                    text-left text-xs font-medium
                    text-[#667085]
                    dark:text-[#94A3B8]
                  "
                >
                  End Time
                </th>

                <th
                  className="
                    px-5 py-3
                    text-left text-xs font-medium
                    text-[#667085]
                    dark:text-[#94A3B8]
                  "
                >
                  Slot Duration
                </th>

                <th
                  className="
                    px-5 py-3
                    text-left text-xs font-medium
                    text-[#667085]
                    dark:text-[#94A3B8]
                  "
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {schedules
                .sort((a, b) => a.day_of_week - b.day_of_week)
                .map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="
                      border-b border-gray-100
                      last:border-b-0

                      dark:border-[#24344D]
                    "
                  >
                    {/* Day */}
                    <td
                      className="
                        px-5 py-4
                        text-sm font-medium
                        text-[#0A1B39]
                        dark:text-[#F1F5F9]
                      "
                    >
                      {weekDays[schedule.day_of_week]}
                    </td>

                    {/* Start Time */}
                    <td
                      className="
                        px-5 py-4
                        text-sm
                        text-[#667085]
                        dark:text-[#CBD5E1]
                      "
                    >
                      {formatTime(schedule.start_time)}
                    </td>

                    {/* End Time */}
                    <td
                      className="
                        px-5 py-4
                        text-sm
                        text-[#667085]
                        dark:text-[#CBD5E1]
                      "
                    >
                      {formatTime(schedule.end_time)}
                    </td>

                    {/* Slot Duration */}
                    <td
                      className="
                        px-5 py-4
                        text-sm
                        text-[#667085]
                        dark:text-[#CBD5E1]
                      "
                    >
                      {schedule.slot_duration_minutes} minutes
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          schedule.is_active
                            ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
                        }`}
                      >
                        {schedule.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}