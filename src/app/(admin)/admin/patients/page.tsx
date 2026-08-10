import { getPatients } from "@/features/patients/actions";
import PatientsList from "@/features/patients/components/PatientsList";
import Link from "next/link";

export default async function AdminPatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6 px-4 sm:px-6">
     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div className="min-w-0">
    <div className="flex items-center gap-2 flex-wrap">
      <h1 className="text-lg sm:text-2xl font-semibold text-slate-900">
        Patients List
      </h1>
      <span className="shrink-0 whitespace-nowrap rounded-md border border-blue-600 px-2 py-0.5 text-xs sm:text-sm text-blue-600">
        Total Patients : {patients.length}
      </span>
    </div>
  </div>

  <Link
    href="/admin/patients/NewPatient"
    className="
    inline-flex
    items-center
    justify-center
    w-full
    sm:w-auto
    rounded-md 
    bg-blue-700 
    px-4 
    py-2 
    text-sm 
    font-medium 
    text-white
    "
  >
    + New Patient
  </Link>
</div>

      {/* Table */}
      <PatientsList patients={patients} />
    </div>
  );
}