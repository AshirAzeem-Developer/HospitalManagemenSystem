import PatientDetail from "@/features/patients/components/PatientDetail";
import { getPatientDetail } from "@/features/patients/actions";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const patient = await getPatientDetail(id);

  return (
    <PatientDetail
      patient={patient}
      // appointments={[]}
      // totalPages={1}
    />
  );
}