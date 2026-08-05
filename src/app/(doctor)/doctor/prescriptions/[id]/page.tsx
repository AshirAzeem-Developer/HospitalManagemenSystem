import PrescriptionDetail from "@/features/prescriptions/components/prescription-detail";
import { prescriptionDummyDetail } from "@/features/prescriptions/data/dummy-prescription-detail";
import { notFound } from "next/navigation";

export default async function PrescriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const prescription = prescriptionDummyDetail.find((pres) => pres.id === id);
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
