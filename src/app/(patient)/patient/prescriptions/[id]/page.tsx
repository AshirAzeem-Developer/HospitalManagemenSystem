import { notFound } from "next/navigation";

import PrescriptionDetail from "@/features/prescriptions/components/prescription-detail";
import { getPrescriptionById } from "@/features/prescriptions/actions";

export default async function PatientPrescriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getPrescriptionById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <PrescriptionDetail data={result.data} />;
}
