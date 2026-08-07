import { Images } from "@/assets";
import CreatePrescriptionForm from "@/features/prescriptions/components/create-prescription-form";

export default function CreatePrescriptionPage() {
  const patient = {
    image: Images.User1,
    name: "John Richard",
    id: "PT0025",
    age: 28,
    gender: "Male",
    bloodGroup: "O+",
  };

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Prescription</h1>

        <p className="mt-2 text-sm text-slate-500">
          Fill in the patient's prescription details.
        </p>
      </div>

      <CreatePrescriptionForm patient={patient} />
    </section>
  );
}
