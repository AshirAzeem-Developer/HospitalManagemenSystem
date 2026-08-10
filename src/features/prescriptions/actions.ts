"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

import {
  CreatePrescriptionInput,
  CreatePrescriptionSchema,
} from "./schema";

export async function createPrescription(
  values: CreatePrescriptionInput
) {
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

console.log("USER ID:", user.id);
console.log("DOCTOR ID:", doctor.id);
// console.log("PATIENT ID:", doctor.id);
  // Appointment
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("patient_id")
    .eq("id", parsed.data.appointmentId)
    .single();

  if (appointmentError || !appointment) {
    return {
      success: false,
      message: "Appointment not found",
    };
  }

  console.log("Appointment:", appointment);
console.log("Patient ID:", appointment.patient_id);

  //Patient
  const { data:patient , error: patientError} = await supabase
  .from("patients").select("*").eq("id", appointment.patient_id).single()


  console.log("Patient:", patient)
  console.log("Patient Error:", patientError);

  // Profile 

  const {data:profile, error:profileError} = await supabase
  .from("profiles").select("*").eq("id",patient.profile_id).single()

  console.log("Profile", profile)
  console.log("Profile Error", profileError)
  // Prescription
  const { data: prescription, error: prescriptionError } =
    await supabase
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
      message: prescriptionError?.message,
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
  const { data: prescription, error: prescriptionError } =
    await supabase
      .from("prescriptions")
      .select(`
        id,
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
      `)
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
    .select(`
      id,
      profile_id,
      date_of_birth,
      blood_group
    `)
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
    .select(`
      full_name,
      gender,
      avatar_url
    `)
    .eq("id", patient.profile_id)
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      message: "Patient profile not found",
    };
  }

  // 4. Medicines
  const { data: medicines, error: medicinesError } =
    await supabase
      .from("prescription_items")
      .select(`
        id,
        medicine_name,
        dosage,
        frequency,
        duration,
        timing,
        instructions
      `)
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