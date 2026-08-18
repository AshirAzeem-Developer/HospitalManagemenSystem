import { getAppointments, getDoctors } from "@/features/appointments/appointmentActions/appointmentAction";
import { getPrescriptionsByAppointmentIds } from "@/features/prescriptions/actions";
import PatientAppointmentsContainer from "@/features/appointments/appointmentContainers/adminAppointmentsContainer";

export default async function PatientAppointmentsPage() {
  const appointments = await getAppointments() || [];
  const doctors = await getDoctors() || [];


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
      <PatientAppointmentsContainer
        initialAppointments={appointmentsWithPrescriptions}
        doctorsList={doctors}
        newAppointmentUrl="/patient/appointments/book"
      />
    </div>
  );
}