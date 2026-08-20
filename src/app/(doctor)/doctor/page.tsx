import { getDoctorDashboard } from "@/features/doctors/queries";
import DoctorUpcomingAppointments from "@/features/doctors/components/doctor-upcoming-appointments";
import DoctorRecentAppointments from "@/features/doctors/components/doctor-recent-appointments";
import DoctorTopPatients from "@/features/doctors/components/doctor-top-patients";
import DoctorSchedule from "@/features/doctors/components/doctor-schedule";
import DoctorAppointmentStatusChart from "@/features/doctors/components/doctor-appointment-status-chart";
import DoctorMonthlyAppointmentsChart from "@/features/doctors/components/doctor-monthly-appointments-chart";
import {
  CalendarDays,
  CalendarClock,
  CircleCheck,
  CircleX,
} from "lucide-react";

export default async function DoctorDashboardPage() {
  const dashboard = await getDoctorDashboard();

  if (!dashboard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-[#94A3B8]">
          Unable to load doctor dashboard.
        </p>
      </div>
    );
  }

  const { statistics } = dashboard;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="pb-5">
        <h1 className="text-2xl font-semibold text-[#0A1B39] dark:text-[#F1F5F9]">
          Doctor Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#667085] dark:text-[#94A3B8]">
          Welcome back, {dashboard.doctor.full_name}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Appointments */}
        <div
          className="
            group relative overflow-hidden rounded-2xl
            border border-blue-100
            bg-white
            p-5
            shadow-sm
            transition-all duration-200
            hover:-translate-y-1 hover:shadow-md

            dark:border-[#2A3850]
            dark:bg-[#0A162A]
            dark:shadow-none
            dark:hover:bg-[#0D1B31]
          "
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085] dark:text-[#94A3B8]">
                Total Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#0A1B39] dark:text-[#F1F5F9]">
                {statistics.totalAppointments}
              </p>

              <p className="mt-1 text-xs text-gray-400 dark:text-[#64748B]">
                All appointments
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
                dark:bg-blue-500/10
                dark:text-blue-400
              "
            >
              <CalendarDays size={22} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div
          className="
            group relative overflow-hidden rounded-2xl
            border border-indigo-100
            bg-white
            p-5
            shadow-sm
            transition-all duration-200
            hover:-translate-y-1 hover:shadow-md

            dark:border-[#2A3850]
            dark:bg-[#0A162A]
            dark:shadow-none
            dark:hover:bg-[#0D1B31]
          "
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-[#E2B93B]" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085] dark:text-[#94A3B8]">
                Upcoming Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#0A1B39] dark:text-[#F1F5F9]">
                {statistics.upcomingAppointments}
              </p>

              <p className="mt-1 text-xs text-gray-400 dark:text-[#64748B]">
                Scheduled appointments
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl
                bg-[#E2B93B]/10
                text-[#E2B93B]
                dark:bg-[#E2B93B]/10
                dark:text-[#E8C85A]
              "
            >
              <CalendarClock size={22} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div
          className="
            group relative overflow-hidden rounded-2xl
            border border-emerald-100
            bg-white
            p-5
            shadow-sm
            transition-all duration-200
            hover:-translate-y-1 hover:shadow-md

            dark:border-[#2A3850]
            dark:bg-[#0A162A]
            dark:shadow-none
            dark:hover:bg-[#0D1B31]
          "
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085] dark:text-[#94A3B8]">
                Completed Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#0A1B39] dark:text-[#F1F5F9]">
                {statistics.completedAppointments}
              </p>

              <p className="mt-1 text-xs text-gray-400 dark:text-[#64748B]">
                Successfully completed
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
                dark:bg-emerald-500/10
                dark:text-emerald-400
              "
            >
              <CircleCheck size={22} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div
          className="
            group relative overflow-hidden rounded-2xl
            border border-red-100
            bg-white
            p-5
            shadow-sm
            transition-all duration-200
            hover:-translate-y-1 hover:shadow-md

            dark:border-[#2A3850]
            dark:bg-[#0A162A]
            dark:shadow-none
            dark:hover:bg-[#0D1B31]
          "
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085] dark:text-[#94A3B8]">
                Cancelled Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#0A1B39] dark:text-[#F1F5F9]">
                {statistics.cancelledAppointments}
              </p>

              <p className="mt-1 text-xs text-gray-400 dark:text-[#64748B]">
                Cancelled appointments
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl
                bg-red-50
                text-red-600
                dark:bg-red-500/10
                dark:text-red-400
              "
            >
              <CircleX size={22} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DoctorAppointmentStatusChart
          stats={dashboard.appointmentStats}
        />

        <DoctorMonthlyAppointmentsChart
          data={dashboard.monthlyAppointments}
        />
      </div>

      {/* Recent Appointments */}
      <DoctorRecentAppointments
        appointments={dashboard.recentAppointments}
      />

      {/* Upcoming + Top Patients */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DoctorUpcomingAppointments
          appointments={dashboard.upcomingAppointments}
        />

        <DoctorTopPatients
          patients={dashboard.topPatients}
        />
      </div>

      {/* Schedule */}
      <DoctorSchedule schedules={dashboard.schedules} />
    </div>
  );
}