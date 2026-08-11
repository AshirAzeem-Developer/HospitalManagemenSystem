import Link from "next/link";
import { List, LayoutGrid, Plus } from "lucide-react";
import {
  PatientCard,
} from "@/features/patients/components/PatientCard";
import { getPatientsForGrid } from "@/features/patients/actions";

export default async function PatientsGridViewPage() {
  const patients = await getPatientsForGrid();

  return (
    <div className="space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
            Patient Grid
          </h1>

          <span className="shrink-0 whitespace-nowrap rounded-md border border-blue-600 px-2 py-0.5 text-xs text-blue-600 sm:text-sm">
            Total Patients : {patients.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* List / Grid toggle */}
          <div className="flex items-center rounded-md border border-slate-200 p-1">
            <Link
              href="/admin/patients"
              className="flex h-8 w-8 items-center justify-center rounded text-slate-500 hover:bg-slate-50"
            >
              <List size={16} />
            </Link>

            <span className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-900">
              <LayoutGrid size={16} />
            </span>
          </div>

          {/* New Patient */}
          <Link
            href="/admin/patients/NewPatient"
            className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            <Plus size={16} />
            New Patient
          </Link>
        </div>
      </div>

      {/* Grid */}
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