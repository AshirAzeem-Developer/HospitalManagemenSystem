import { notFound } from "next/navigation";

import { getPrescriptionById } from "@/features/prescriptions/actions";
import EditPrescriptionForm from "@/features/prescriptions/components/edit-prescription-form";

export default async function EditPrescriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getPrescriptionById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <EditPrescriptionForm prescriptionId={id} data={result.data} />;
}
