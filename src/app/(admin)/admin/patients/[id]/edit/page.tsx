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
    <div className="space-y-6">
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