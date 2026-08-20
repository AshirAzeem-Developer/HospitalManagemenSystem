import Link from "next/link";
import { List, LayoutGrid } from "lucide-react";
import Button from "@/components/ui/button";
import { PatientCard } from "@/features/patients/components/PatientCard";
import { getPatientsForGrid } from "@/features/patients/actions";

export default async function PatientsGridViewPage() {
  const patients = await getPatientsForGrid();

  return (
    <div className="min-h-screen space-y-6 bg-[#F5F6F8] p-6 -m-6 dark:bg-gray-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-2xl">
            Patient Grid
          </h1>

          <Button
            variant="status-primary"
            text={`Total Patients : ${patients.length}`}
            type="button"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border border-slate-300 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-900">
            <Link href="/admin/patients">
              <List
                size={16}
                className="text-slate-400 hover:text-slate-600"
              />
            </Link>

            <LayoutGrid size={16} className="text-blue-600" />
          </div>

          <Link
            href="/admin/patients/NewPatient"
            className="w-auto"
          >
            <Button
              variant="primary"
              text="+ New Patient"
              type="button"
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
          />
        ))}
      </div>
    </div>
  );
}