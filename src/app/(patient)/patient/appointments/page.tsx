import {
  getAppointments,
  getDoctors,
} from "@/features/appointments/appointmentActions/appointmentAction";
import { getPrescriptionsByAppointmentIds } from "@/features/prescriptions/actions";
import PatientAppointmentsContainer from "@/features/appointments/appointmentContainers/patientApointmentContainer";

export type Appointment = {
  id: string | number;
  date: string;
  time: string;
  status: string;
  patientId: string | number;
  doctorId: string | number;
  patientName: string;
  patientImage?: string | null;
  doctorName: string;
  doctorImage?: string | null;
  prescriptionId?: string | null;
};

type Doctor = {
  id?: string | number;
  _id?: string | number;
  name?: string;
  profile?: { full_name?: string };
  [key: string]: unknown;
};

export default async function PatientAppointmentsPage() {
  const appointments: Appointment[] = (await getAppointments()) || [];
  const doctors: Doctor[] = (await getDoctors()) || [];

  let appointmentsWithPrescriptions: Appointment[] = appointments;

  if (appointments.length > 0) {
    const ids = appointments.map((a) => String(a.id)).filter(Boolean);
    const statusResult = await getPrescriptionsByAppointmentIds(ids);
    const statusMap = statusResult?.success ? statusResult.data : {};

    appointmentsWithPrescriptions = appointments.map((appointment) => ({
      ...appointment,
      prescriptionId: statusMap?.[String(appointment.id)] ?? null,
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
