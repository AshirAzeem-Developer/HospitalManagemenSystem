"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

import {
  CreatePrescriptionInput,
  CreatePrescriptionSchema,
  UpdatePrescriptionInput,
  UpdatePrescriptionSchema,
} from "./schema";

export async function createPrescription(values: CreatePrescriptionInput) {
  const parsed = CreatePrescriptionSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  // Logged In User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  // Doctor
  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (doctorError || !doctor) {
    return {
      success: false,
      message: "Doctor not found",
    };
  }

  // Appointment — scoped to this doctor so a doctor can't create a
  // prescription against another doctor's appointment.
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("patient_id")
    .eq("id", parsed.data.appointmentId)
    .eq("doctor_id", doctor.id)
    .single();

  if (appointmentError || !appointment) {
    return {
      success: false,
      message: "Appointment not found",
    };
  }

  // Prescription
  const { data: prescription, error: prescriptionError } = await supabase
    .from("prescriptions")
    .insert({
      appointment_id: parsed.data.appointmentId,
      patient_id: appointment.patient_id,
      doctor_id: doctor.id,
      diagnosis: parsed.data.diagnosis,
      blood_pressure: parsed.data.bloodPressure,
      temperature: parsed.data.temperature,
      pulse_rate: parsed.data.pulseRate,
      weight: parsed.data.weight,
      height: parsed.data.height,
      spo2: parsed.data.spo2,
      advice: parsed.data.advice,
    })
    .select()
    .single();

  if (prescriptionError || !prescription) {
    return {
      success: false,
      message: prescriptionError?.message ?? "Failed to create prescription",
    };
  }

  // Medicines
  const medicineRows = parsed.data.medicines.map((medicine) => ({
    prescription_id: prescription.id,
    medicine_name: medicine.medicineName,
    dosage: medicine.dosage,
    frequency: medicine.frequency,
    duration: medicine.duration,
    timing: medicine.timing,
    instructions: medicine.instructions,
  }));

  const { error: medicineError } = await supabase
    .from("prescription_items")
    .insert(medicineRows);

  if (medicineError) {
    // Compensate for the partial write so we don't leave an orphaned
    // prescription with zero medicines. Ideally this whole function
    // becomes a single Postgres RPC so both inserts are truly atomic.
    await supabase.from("prescriptions").delete().eq("id", prescription.id);

    return {
      success: false,
      message: medicineError.message,
    };
  }

  revalidatePath("/doctor/prescriptions");

  return {
    success: true,
    message: "Prescription created successfully",
  };
}

export async function getPrescriptionById(id: string) {
  const supabase = await createClient();

  // 1. Prescription
  const { data: prescription, error: prescriptionError } = await supabase
    .from("prescriptions")
    .select(
      `
      id,
      appointment_id,
      patient_id,
      doctor_id,
      diagnosis,
      blood_pressure,
      temperature,
      pulse_rate,
      weight,
      height,
      spo2,
      advice,
      created_at
    `,
    )
    .eq("id", id)
    .single();

  if (prescriptionError || !prescription) {
    return {
      success: false,
      message: "Prescription not found",
    };
  }

  // 2. Patient
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select(
      `
      id,
      profile_id,
      date_of_birth,
      blood_group
    `,
    )
    .eq("id", prescription.patient_id)
    .single();

  if (patientError || !patient) {
    return {
      success: false,
      message: "Patient not found",
    };
  }

  // 3. Profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
      full_name,
      gender,
      avatar_url
    `,
    )
    .eq("id", patient.profile_id)
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      message: "Patient profile not found",
    };
  }

  // 4. Medicines
  const { data: medicines, error: medicinesError } = await supabase
    .from("prescription_items")
    .select(
      `
      id,
      medicine_name,
      dosage,
      frequency,
      duration,
      timing,
      instructions
    `,
    )
    .eq("prescription_id", prescription.id);

  if (medicinesError) {
    return {
      success: false,
      message: "Medicines not found",
    };
  }

  return {
    success: true,
    data: {
      prescription,
      patient,
      profile,
      medicines,
    },
  };
}

export async function updatePrescription(
  prescriptionId: string,
  values: UpdatePrescriptionInput,
) {
  const parsed = UpdatePrescriptionSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (doctorError || !doctor) {
    return {
      success: false,
      message: "Doctor not found",
    };
  }

  // Confirm this prescription exists AND belongs to this doctor before
  // touching anything — same ownership pattern as createPrescription's
  // appointment lookup.
  const { data: existing, error: existingError } = await supabase
    .from("prescriptions")
    .select("id")
    .eq("id", prescriptionId)
    .eq("doctor_id", doctor.id)
    .single();

  if (existingError || !existing) {
    return {
      success: false,
      message: "Prescription not found or not yours to edit",
    };
  }

  // Update the prescription record itself
  const { error: updateError } = await supabase
    .from("prescriptions")
    .update({
      diagnosis: parsed.data.diagnosis,
      blood_pressure: parsed.data.bloodPressure,
      temperature: parsed.data.temperature,
      pulse_rate: parsed.data.pulseRate,
      weight: parsed.data.weight,
      height: parsed.data.height,
      spo2: parsed.data.spo2,
      advice: parsed.data.advice,
    })
    .eq("id", prescriptionId);

  if (updateError) {
    return {
      success: false,
      message: updateError.message,
    };
  }

  // Full-replace strategy for medicines: delete the old line items and
  // insert the new set. Simpler and safer than diffing rows for a typical
  // edit-prescription form, at the cost of new ids for unchanged medicines.
  const { error: deleteItemsError } = await supabase
    .from("prescription_items")
    .delete()
    .eq("prescription_id", prescriptionId);

  if (deleteItemsError) {
    return {
      success: false,
      message: deleteItemsError.message,
    };
  }

  const medicineRows = parsed.data.medicines.map((medicine) => ({
    prescription_id: prescriptionId,
    medicine_name: medicine.medicineName,
    dosage: medicine.dosage,
    frequency: medicine.frequency,
    duration: medicine.duration,
    timing: medicine.timing,
    instructions: medicine.instructions,
  }));

  const { error: insertItemsError } = await supabase
    .from("prescription_items")
    .insert(medicineRows);

  if (insertItemsError) {
    return {
      success: false,
      message: insertItemsError.message,
    };
  }

  revalidatePath("/doctor/prescriptions");
  revalidatePath(`/doctor/prescriptions/${prescriptionId}`);

  return {
    success: true,
    message: "Prescription updated successfully",
  };
}

export async function deletePrescription(prescriptionId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (doctorError || !doctor) {
    return {
      success: false,
      message: "Doctor not found",
    };
  }

  // prescription_items should cascade via an ON DELETE CASCADE foreign key
  // on prescription_id — if your schema isn't set up that way, delete the
  // items explicitly here first before deleting the prescription row.
  const { error: deleteError, count } = await supabase
    .from("prescriptions")
    .delete({ count: "exact" })
    .eq("id", prescriptionId)
    .eq("doctor_id", doctor.id);

  if (deleteError) {
    return {
      success: false,
      message: "Failed to delete prescription.",
    };
  }

  if (!count) {
    return {
      success: false,
      message: "Prescription not found or not yours to delete.",
    };
  }

  revalidatePath("/doctor/prescriptions");

  return {
    success: true,
    message: "Prescription deleted successfully",
  };
}

