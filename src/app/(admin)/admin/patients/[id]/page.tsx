import PatientDetail from "@/features/patients/components/PatientDetail";
import { getPatientDetail } from "@/features/patients/actions";
import { getInvoicesAction } from "@/features/billing/actions";
import {
  getAppointments,
  getDoctors,
} from "@/features/appointments/appointmentActions/appointmentAction";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const patient = await getPatientDetail(id);
  const allInvoices = await getInvoicesAction();
  const allAppointments = (await getAppointments()) || [];
//   console.log("DETAIL PATIENT ID:", id);
// console.log("ALL APPOINTMENTS:", allAppointments);
  const doctors = (await getDoctors()) || [];

  // Filter invoices belonging to this patient only.
  // Adjust the field below to match your actual schema.
  const patientInvoices = allInvoices.filter(
    (invoice: any) =>
      invoice.patient_id === id || invoice.patients?.id === id
  );

  // Filter appointments belonging to this patient only.
 
  const patientAppointments = allAppointments.filter(
  (appointment: any) => appointment.patientId === id
);
// console.log("PATIENT APPOINTMENTS:", patientAppointments);
  return (
    <PatientDetail
      patient={patient}
      invoices={patientInvoices}
      appointments={patientAppointments}
      doctors={doctors}
    />
  );
}