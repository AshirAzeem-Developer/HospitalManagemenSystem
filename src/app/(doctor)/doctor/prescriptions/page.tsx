import { createClient } from "@/lib/supabase/server";

import PrescriptionTable from "@/features/prescriptions/components/prescription-table";

export default async function PrescriptionsPage() {
  const supabase = await createClient();

  // Logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Unauthorized</p>;
  }

  // Logged-in doctor
  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (doctorError || !doctor) {
    return <p>Doctor not found</p>;
  }

  // Doctor ki prescriptions
  const { data: prescriptions, error: prescriptionsError } =
    await supabase
      .from("prescriptions")
      .select("id, patient_id, created_at")
      .eq("doctor_id", doctor.id)
      .order("created_at", { ascending: false });

  if (prescriptionsError) {
    console.log("Prescriptions Error:", prescriptionsError);

    return <p>Failed to load prescriptions.</p>;
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <section>
        <p className="p-6 text-gray-500">
          No prescriptions found.
        </p>
      </section>
    );
  }

  // ---------------------------------------
  // Patient IDs nikalo
  // ---------------------------------------

  const patientIds = prescriptions.map(
    (prescription) => prescription.patient_id,
  );

  // ---------------------------------------
  // Patients
  // ---------------------------------------

  const { data: patients, error: patientsError } = await supabase
    .from("patients")
    .select("id, profile_id")
    .in("id", patientIds);

  if (patientsError) {
    console.log("Patients Error:", patientsError);

    return <p>Failed to load patients.</p>;
  }

  // ---------------------------------------
  // Profile IDs
  // ---------------------------------------

  const profileIds = (patients ?? []).map(
    (patient) => patient.profile_id,
  );

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", profileIds);

  if (profilesError) {
    console.log("Profiles Error:", profilesError);

    return <p>Failed to load patient profiles.</p>;
  }

  // ---------------------------------------
  // Patient + Profile ko easily find karne
  // ke liye Maps
  // ---------------------------------------

  const patientMap = new Map(
    (patients ?? []).map((patient) => [
      patient.id,
      patient,
    ]),
  );

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      profile,
    ]),
  );

  // ---------------------------------------
  // Final data jo Table ko milega
  // ---------------------------------------

  const prescriptionList = prescriptions.map(
    (prescription) => {
      const patient = patientMap.get(
        prescription.patient_id,
      );

      const profile = patient
        ? profileMap.get(patient.profile_id)
        : null;

      return {
        id: prescription.id,
        patientName: profile?.full_name ?? "Unknown Patient",
        patientImage: profile?.avatar_url ?? null,
        prescribedOn: new Date(
          prescription.created_at,
        ).toLocaleDateString("en-GB"),
      };
    },
  );

  return (
    <section>
      <PrescriptionTable
        prescriptions={prescriptionList}
      />
    </section>
  );
}