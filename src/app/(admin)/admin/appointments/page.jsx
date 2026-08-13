import { getAppointments, getDoctors } from "@/features/appointments/appointmentActions/appointmentAction"; 
import AppointmentsContainer from "@/features/appointments/components/AppointmentsContainer";

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments() || [];
  const doctors = await getDoctors() || []; 

  return (
    <div className="flex flex-col bg-background text-foreground min-h-screen">
      <AppointmentsContainer 
        initialAppointments={appointments}
        doctorsList={doctors} 
        newAppointmentUrl="/admin/appointments/new"
      />
    </div>
  );
}