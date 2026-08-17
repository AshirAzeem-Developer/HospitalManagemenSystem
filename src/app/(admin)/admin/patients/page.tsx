import { getPatients } from "@/features/patients/actions";
import PatientsList from "@/features/patients/components/PatientsList";
import Link from "next/link";
import { List, LayoutGrid } from "lucide-react";
import Button from "@/components/ui/button";

export default async function AdminPatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6  sm:px-6 min-h-screen p-6 -m-6 bg-[#F5F6F8]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
            Patient Grid
          </h1>

          <Button
            variant="status-primary"
            text={`Total Patients : ${patients.length}`}
            type="button"
          />
        </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          {/* List / Grid Toggle */}
         <div className="flex items-center gap-2 border border-slate-300 bg-white px-2 py-1">
  {/* List View - Active */}
  <List
    size={16}
    className="text-blue-600"
  />

  {/* Grid View */}
  <Link href="/admin/patients/grid-view">
    <LayoutGrid
      size={16}
      className="text-slate-400 hover:text-slate-600"
    />
  </Link>
</div>

          {/* New Patient */}
          <Link
            href="/admin/patients/NewPatient"
            className="w-full sm:w-auto"
          >
            <Button
              text="+ New Patient"
              variant="primary"
              type="button"
              className="w-full sm:w-auto"
            />
          </Link>
        </div>
      </div>

      {/* Patient Table */}
      <PatientsList patients={patients} />
    </div>
  );
}