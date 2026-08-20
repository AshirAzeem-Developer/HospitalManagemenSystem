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
  const appointmentId = params.appointmentId;

  if (!appointmentId) {
    return (
      <p className="p-6 text-muted">
        No appointment selected. Open this page from an appointment&apos;s
        &quot;Create Prescription&quot; action.
      </p>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="p-6 text-muted">Unauthorized</p>;
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (doctorError || !doctor) {
    return <p className="p-6 text-muted">Doctor not found</p>;
  }

  // Scoped to this doctor — matches the same ownership rule enforced in
  // createPrescription itself, so a doctor can't even reach this form for
  // an appointment that isn't theirs.
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("patient_id")
    .eq("id", appointmentId)
    .eq("doctor_id", doctor.id)
    .single();

  if (appointmentError || !appointment) {
    notFound();
  }

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("id, profile_id, date_of_birth, blood_group")
    .eq("id", appointment.patient_id)
    .single();

  if (patientError || !patient) {
    notFound();
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, gender, avatar_url")
    .eq("id", patient.profile_id)
    .single();

  if (profileError || !profile) {
    notFound();
  }

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
        <h1 className="text-2xl font-semibold text-foreground">
          Create Prescription
        </h1>

        <p className="mt-2 text-sm text-muted">
          Fill in the patient&apos;s prescription details.
        </p>
      </div>

      <CreatePrescriptionForm
        patient={patientInformation}
        appointmentId={appointmentId}
      />
    </section>
  );
}
