import { getAppointments } from "@/features/appointments/appointmentActions/appointmentAction";
import { getPrescriptionsByAppointmentIds } from "@/features/prescriptions/actions";
import DoctorAppointmentsContainer from "@/features/appointmentContainers/DoctorAppointmentsContainer";

export default async function DoctorAppointmentsPage() {
  const appointments = await getAppointments() || [];

  let appointmentsWithPrescriptions = appointments;

  if (appointments.length > 0) {
    const ids = appointments.map((a) => a.id).filter(Boolean);
    const statusResult = await getPrescriptionsByAppointmentIds(ids);
    const statusMap = statusResult?.success ? statusResult.data : {};

    appointmentsWithPrescriptions = appointments.map((appointment) => ({
      ...appointment,
      prescriptionId: statusMap[appointment.id] ?? null,
    }));
  }

  return (
    <div className="min-h-screen bg-page p-4 md:p-6">
      <DoctorAppointmentsContainer
        initialAppointments={appointmentsWithPrescriptions}
      />
    </div>
  );
}