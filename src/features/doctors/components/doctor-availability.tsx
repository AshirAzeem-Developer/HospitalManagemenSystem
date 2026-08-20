import type { DoctorSchedule } from "../types";

type Props = {
  schedules: DoctorSchedule[];
};

const days = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DoctorAvailability({
  schedules,
}: Props) {
  const activeSchedules = schedules.filter(
    (schedule) => schedule.isActive,
  );

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0A162A] sm:p-5">
      
      {/* Heading */}
      <div>
        <h2 className="text-base font-semibold text-[#0A1B39] dark:text-white sm:text-lg">
          Availability
        </h2>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          Doctor's available consultation hours
        </p>
      </div>

      {/* Days */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => {
          const schedule = activeSchedules.find(
            (item) => item.dayOfWeek === day.value,
          );

          return (
            <div
              key={day.value}
              className={`min-w-[100px] rounded-lg border px-3 py-3 text-center ${
                schedule
                  ? "border-[#2E37A4] bg-[#F1F2FF] dark:border-[#4A54C6] dark:bg-[#1A2550]"
                  : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-[#111F35]"
              }`}
            >
              <p
                className={`text-xs font-semibold ${
                  schedule
                    ? "text-[#2E37A4] dark:text-[#8B92E8]"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {day.label}
              </p>

              {schedule ? (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {formatTime(schedule.startTime)}
                  {" - "}
                  {formatTime(schedule.endTime)}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Not available
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Details */}
      <div className="mt-5 space-y-3">
        {activeSchedules.length === 0 ? (
          <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-[#111F35]">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No active schedule available.
            </p>
          </div>
        ) : (
          activeSchedules.map((schedule) => {
            const day = days.find(
              (item) => item.value === schedule.dayOfWeek,
            );

            return (
              <div
                key={schedule.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-100 p-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {day?.label ?? "Unknown Day"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Consultation hours
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-[#F1F2FF] px-3 py-1.5 text-xs font-medium text-[#2E37A4] dark:bg-[#1A2550] dark:text-[#8B92E8]">
                    {formatTime(schedule.startTime)}
                    {" - "}
                    {formatTime(schedule.endTime)}
                  </span>

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {schedule.slotDurationMinutes} min slots
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}