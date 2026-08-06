import PrescriptionDetail from "@/features/prescriptions/components/prescription-detail";
import { prescriptionDetail } from "@/features/prescriptions/data/prescription-detail";
import { notFound } from "next/navigation";

export default async function PrescriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const prescription = prescriptionDetail.find((pres) => pres.id === id);
  console.log(prescription);
  if (!prescription) {
    return notFound();
  }
  return (
    <>
      <PrescriptionDetail prescription={prescription} />
    </>
  );
}
