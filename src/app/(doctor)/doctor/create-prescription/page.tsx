import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import CreatePrescriptionForm from "@/features/prescriptions/components/create-prescription-form";

interface CreatePrescriptionPageProps {
  searchParams: Promise<{
    appointmentId?: string;
  }>;
}

export default async function CreatePrescriptionPage({
  searchParams,
}: CreatePrescriptionPageProps) {
  const params = await searchParams;

  // const appointmentId = params.appointmentId;

  //THe below line will be removed when irfan works completed
  const appointmentId = "44444444-4444-4444-4444-444444444405";

  if (!appointmentId) {
    return <p>Appointment ID is missing.</p>;
  }

  const supabase = await createClient();

  // 1. Appointment se patient_id nikalo
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("patient_id")
    .eq("id", appointmentId)
    .single();

  if (appointmentError || !appointment) {
    notFound();
  }

  // 2. Patient table se patient data
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("id, profile_id, date_of_birth, blood_group")
    .eq("id", appointment.patient_id)
    .single();

  if (patientError || !patient) {
    notFound();
  }

  // 3. Profile table se name, gender aur image
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, gender, avatar_url")
    .eq("id", patient.profile_id)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // 4. Patient + Profile ko ek object mein combine kar rahe hain
  const patientInformation = {
    id: patient.id,
    full_name: profile.full_name,
    date_of_birth: patient.date_of_birth,
    gender: profile.gender,
    blood_group: patient.blood_group,
    image: profile.avatar_url,
  };

  return (
    <section>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Create Prescription
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Fill in the patient's prescription details.
        </p>
      </div>

      <CreatePrescriptionForm patient={patientInformation} />
    </section>
  );
}
// Ye page patient ki information dikhane keliye he jo create prescription ke top pr aega
//
