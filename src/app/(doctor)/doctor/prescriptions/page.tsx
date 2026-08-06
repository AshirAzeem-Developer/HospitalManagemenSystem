import PrescriptionTable from "@/features/prescriptions/components/prescription-table";
import { Images } from "@/assets";
import { prescriptionList } from "@/features/prescriptions/data/prescription-list";


export default function PrescriptionsPage() {
  return (
    <section className="">
      <PrescriptionTable prescriptions={prescriptionList} />
    </section>
  );
}
