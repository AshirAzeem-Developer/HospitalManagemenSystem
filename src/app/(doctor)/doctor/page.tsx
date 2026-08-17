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
        <p className="text-sm text-gray-500">
          Unable to load doctor dashboard.
        </p>
      </div>
    );
  }

  const { statistics } = dashboard;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-semibold text-[#0A1B39]">
          Doctor Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#667085]">
          Welcome back, {dashboard.doctor.full_name}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Appointments */}
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">
                Total Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#0A1B39]">
                {statistics.totalAppointments}
              </p>

              <p className="mt-1 text-xs text-gray-400">All appointments</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={22} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute left-0 top-0 h-full w-1 bg-[#E2B93B]" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">
                Upcoming Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#0A1B39]">
                {statistics.upcomingAppointments}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Scheduled appointments
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E2B93B]/10 text-[#E2B93B]">
              <CalendarClock size={22} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">
                Completed Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#0A1B39]">
                {statistics.completedAppointments}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Successfully completed
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CircleCheck size={22} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#667085]">
                Cancelled Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#0A1B39]">
                {statistics.cancelledAppointments}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Cancelled appointments
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <CircleX size={22} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DoctorAppointmentStatusChart stats={dashboard.appointmentStats} />

        <DoctorMonthlyAppointmentsChart data={dashboard.monthlyAppointments} />
      </div>
      <DoctorRecentAppointments appointments={dashboard.recentAppointments} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DoctorUpcomingAppointments
          appointments={dashboard.upcomingAppointments}
        />
        <DoctorTopPatients patients={dashboard.topPatients} />
      </div>

      <DoctorSchedule schedules={dashboard.schedules} />
    </div>
  );
}
