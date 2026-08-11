import { getPatients } from "@/features/patients/actions";
import PatientsList from "@/features/patients/components/PatientsList";
import Link from "next/link";
import { List, LayoutGrid } from "lucide-react";

export default async function AdminPatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
              Patients List
            </h1>

            <span className="shrink-0 whitespace-nowrap rounded-md border border-blue-600 px-2 py-0.5 text-xs text-blue-600 sm:text-sm">
              Total Patients : {patients.length}
            </span>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="flex items-center rounded-md border border-slate-200 p-1">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-900">
              <List size={16} />
            </span>
            <Link
              href="/admin/patients/grid-view"
              className="flex h-8 w-8 items-center justify-center rounded text-slate-500 hover:bg-slate-50"
            >
              <LayoutGrid size={16} />
            </Link>
          </div>

          <Link
            href="/admin/patients/NewPatient"
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 sm:w-auto"
          >
            + New Patient
          </Link>
        </div>
      </div>

      {/* Table */}
      <PatientsList patients={patients} />
    </div>
  );
}