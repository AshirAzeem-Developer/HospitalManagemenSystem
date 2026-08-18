import PatientForm from "@/features/patients/components/PatientForm";
import { getPatientById ,getDoctors } from "@/features/patients/actions";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";


type Props = {
  params: Promise<{
    id: string;
  }>;
};


export default async function EditPatientPage({ params }: Props) {

  const { id } = await params;

  const patient = await getPatientById(id);
const doctors = await getDoctors();
  console.log("EDIT PATIENT DATA:", patient);

  
  return (
    <div className="min-h-screen p-6 -m-6 space-y-6 bg-[#F5F6F8]">
      
     <div className="mx-auto w-full max-w-4xl px-4 sm:px-8">
        {/* Back link */}
      <Link
        href="/admin/patients"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:text-blue-700"
      >
        <ChevronLeft size={18} />
       Edit Patients
      </Link>
        
      </div>
    <PatientForm
      patient={patient}
      patientId={id}
      doctors={doctors}
    />
    </div>
  );
}