import { getPatients } from "@/features/patients/actions";
import PatientsList from "@/features/patients/components/PatientsList";
import Link from "next/link";
import { List, LayoutGrid } from "lucide-react";
import Button from "@/components/ui/button";

export default async function AdminPatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6 px-4 sm:px-6 min-h-screen p-6 -m-6 space-y-6 bg-[#F5F6F8]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
              Patients List
            </h1>

            <Button
              variant="status-primary"
              text={`Total Patients : ${patients.length}`}
              type="button"
              className="whitespace-nowrap"
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          {/* List / Grid Toggle */}
          <div className="flex items-center  border border-slate-200 px-1">
            {/* Active List View */}
            <Button
              variant="ghost"
              text=""
              icon={<List size={16} />}
              type="button"
              className="h-2 w-5 border-0 bg-slate-100 p-0 text-slate-900"
            />

            {/* Grid View */}
            <Link href="/admin/patients/grid-view">
              <Button
                variant="ghost"
                text=""
                icon={<LayoutGrid size={16} />}
                type="button"
                className="h-8 w-8 border-0 p-0 text-slate-500 hover:bg-slate-50"
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