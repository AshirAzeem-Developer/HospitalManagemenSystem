import PatientForm from "@/features/patients/components/PatientForm";
import { getDoctors } from "@/features/patients/actions";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";

export default async function NewPatientPage() {
  const doctors = await getDoctors();

  return (
    <div className="min-h-screen space-y-6 bg-[#F5F6F8] p-6 -m-6 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-8">
        {/* Back link */}
      <Link
        href="/admin/patients"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-400"
      >
        <ChevronLeft size={18} />
        Patients
      </Link>
        
      </div>

      <PatientForm doctors={doctors as any} />
    </div>
  );
}