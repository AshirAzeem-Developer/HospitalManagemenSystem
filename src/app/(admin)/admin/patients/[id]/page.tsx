import PatientDetail from "@/features/patients/components/PatientDetail";
import { getPatientDetail } from "@/features/patients/actions";
import { getInvoicesAction } from "@/features/billing/actions";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const patient = await getPatientDetail(id);
  const allInvoices = await getInvoicesAction();

  // Filter invoices belonging to this patient only.
  // Adjust the field below to match your actual schema
  // (e.g. invoice.patient_id or invoice.patients.id).
  const patientInvoices = allInvoices.filter(
    (invoice: any) =>
      invoice.patient_id === id || invoice.patients?.id === id
  );

  return (
    <PatientDetail
      patient={patient}
      invoices={patientInvoices}
      // appointments={[]}
      // totalPages={1}
    />
  );
}