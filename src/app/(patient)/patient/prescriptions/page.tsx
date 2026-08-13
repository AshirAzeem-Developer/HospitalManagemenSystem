import PatientPrescriptionTable from "@/features/prescriptions/components/patient-prescription-table";
import { getPatientPrescriptions } from "@/features/prescriptions/actions";

export default async function PatientPrescriptionsPage() {
  const result = await getPatientPrescriptions();

  if (!result.success) {
    return <p className="p-6 text-gray-500">{result.message}</p>;
  }

  return (
    <section>
      <PatientPrescriptionTable prescriptions={result.data ?? []} />
    </section>
  );
}