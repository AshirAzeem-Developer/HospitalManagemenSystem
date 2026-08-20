import { getMyAppointments } from "@/features/doctors/queries";
import DoctorAppointmentTable from "@/features/doctors/components/doctor-appointment-table";
export default async function DoctorAppointmentsPage() {
  const appointments = await getMyAppointments();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
  <div className="mb-6 flex items-center gap-3 pb-5">
  <h1 className="text-xl font-semibold text-[#0A1B39] md:text-2xl dark:text-white">
    My Appointments
  </h1>

        <span className="rounded-md bg-[#EEF0FF] px-2.5 py-1 text-xs font-medium text-[#2E37A4] md:text-sm">
          Total Appointments : {appointments.length}
        </span>
      </div>

      {appointments.length > 0 ? (
        <DoctorAppointmentTable appointments={appointments} />
      ) : (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-10 text-center">
          <div>
            <p className="text-sm font-medium text-gray-700">
              No appointments found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Appointments for this doctor will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}