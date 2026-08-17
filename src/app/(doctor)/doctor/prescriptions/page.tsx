import { createClient } from "@/lib/supabase/server";

import PrescriptionTable from "@/features/prescriptions/components/prescription-table";

export default async function PrescriptionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="p-6 text-foreground">Unauthorized</p>;
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (doctorError || !doctor) {
    return <p className="p-6 text-foreground">Doctor not found</p>;
  }

  const { data: prescriptions, error: prescriptionsError } = await supabase
    .from("prescriptions")
    .select(
      "id, patient_id, created_at, patients!inner(id, profile_id, profiles(full_name, avatar_url))",
    )
    .eq("doctor_id", doctor.id)
    .order("created_at", { ascending: false });

  if (prescriptionsError) {
    console.log("Prescriptions Error:", prescriptionsError);
    return <p className="p-6 text-foreground">Failed to load prescriptions.</p>;
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-background p-6 text-foreground shadow-sm">
        <p className="text-muted">No prescriptions found.</p>
      </section>
    );
  }

  const prescriptionList = prescriptions.map((prescription) => {
    const patient = Array.isArray(prescription.patients)
      ? prescription.patients[0]
      : prescription.patients;

    const profile =
      patient && "profiles" in patient
        ? Array.isArray(patient.profiles)
          ? patient.profiles[0]
          : patient.profiles
        : null;

    return {
      id: prescription.id,
      patientName: profile?.full_name ?? "Unknown Patient",
      patientImage: profile?.avatar_url ?? null,
      prescribedOnRaw: prescription.created_at,
      prescribedOn: new Date(prescription.created_at).toLocaleDateString("en-GB"),
    };
  });

  return (
    <section>
      <PrescriptionTable prescriptions={prescriptionList} />
    </section>
  );
}