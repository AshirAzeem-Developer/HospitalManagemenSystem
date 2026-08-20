import { getAppointments } from "@/features/appointments/appointmentActions/appointmentAction";
import { getPrescriptionsByAppointmentIds } from "@/features/prescriptions/actions";
import DoctorAppointmentsContainer from "@/features/appointments/appointmentContainers/DoctorAppointmentsContainer";

export type Appointment = {
  id: string | number;
  date: string;
  time: string;
  reasonOfVisit?: string | null;
  status: string;
  patientId: string | number;
  doctorId: string | number;
  patientName: string;
  patientImage?: string | null;
  doctorName: string;
  doctorImage?: string | null;
  prescriptionId?: string | null;
};

export default async function DoctorAppointmentsPage() {
  const appointments: Appointment[] = (await getAppointments()) || [];

  let appointmentsWithPrescriptions: Appointment[] = appointments.map(
    (appointment) => ({
      ...appointment,
      prescriptionId: null,
    }),
  );

  if (appointments.length > 0) {
    const ids: string[] = appointments
      .map((appointment) => String(appointment.id))
      .filter(Boolean);

    const statusResult = await getPrescriptionsByAppointmentIds(ids);

    const statusMap =
      statusResult?.success && statusResult.data ? statusResult.data : {};

    appointmentsWithPrescriptions = appointments.map((appointment) => ({
      ...appointment,
      prescriptionId: statusMap?.[String(appointment.id)] ?? null,
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
