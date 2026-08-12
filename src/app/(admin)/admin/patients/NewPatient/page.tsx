import PatientForm from "@/features/patients/components/PatientForm";
import { getDoctors } from "@/features/patients/actions";
import Link from "next/link";

export default async function NewPatientPage() {
  const doctors = await getDoctors();

  return (
    <div className="min-h-screen p-6 -m-6 space-y-6 bg-[#F5F6F8]">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-8">
        <Link
          href="/admin/patients"
          className="inline-block text-lg sm:text-xl font-bold text-slate-900 hover:text-slate-900"
        >
          Patients
        </Link>
      </div>

      <PatientForm doctors={doctors as any} />
    </div>
  );
}