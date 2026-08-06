import { getAppointments } from "@/features/appointments/appointmentActions/appointmentAction"; 
import AppointmentsContainer from "@/features/appointments/components/AppointmentsContainer";

export default async function AdminAppointmentsPage() {
  // Server se appointments fetch kar rahe hain
  const appointments = await getAppointments() || [];

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      <AppointmentsContainer initialAppointments={appointments} />
    </div>
  );
}