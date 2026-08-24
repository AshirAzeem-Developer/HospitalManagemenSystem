import PrescriptionDetail from "@/features/prescriptions/components/prescription-detail";
import { getPrescriptionById } from "@/features/prescriptions/actions";
import { notFound } from "next/navigation";

export default async function PrescriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getPrescriptionById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <PrescriptionDetail
      data={result.data}
      backHref="/doctor/prescriptions"
    />
  );
}
