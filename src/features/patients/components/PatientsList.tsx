import Table from "@/components/ui/table";
import { columns } from "@/features/patients/patient-columns";
import type { PatientRow } from "@/features/patients/types";

type PatientsListProps = {
  patients: PatientRow[];
};

export default function PatientsList({
  patients,
}: PatientsListProps) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <Table columns={columns} data={patients} />
      </div>
    </div>
  );
}