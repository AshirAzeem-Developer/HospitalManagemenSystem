import PatientForm from "@/features/patients/components/PatientForm";
import { getPatientById ,getDoctors } from "@/features/patients/actions";


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
      <h1 className="text-xl font-semibold">
        Edit Patient
      </h1>

    <PatientForm
      patient={patient}
      patientId={id}
      doctors={doctors}
    />
    </div>
  );
}