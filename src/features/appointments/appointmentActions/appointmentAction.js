"use server";

import { createClient } from "@/lib/supabase/server";

// 1. Get All Patients
export async function getPatients() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("patients")
    .select(`
      *,
      profile:profiles (
        full_name,
        gender,
        avatar_url,
        city
      )
    `);

  if (error) {
    console.error("Error fetching patients:", error.message);
    return [];
  }
  return data;
}

// 2. Get All Doctors
export async function getDoctors() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("doctors").select("*");
  
  if (error) {
    console.error("Error fetching doctors:", error.message);
    return [];
  }
  return data;
}

// 3. Get All Statuses
export async function getStatuses() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("statuses").select("*");
  
  if (error) {
    console.error("Error fetching statuses:", error.message);
    return [];
  }
  return data;
}

// ==============================================================
// 4. GET APPOINTMENTS (Table aur Filters ke liye)
// ==============================================================
// ==============================================================
// 4. GET APPOINTMENTS (Table aur Filters ke liye)
// ==============================================================
export async function getAppointments(filters = {}) {
  const supabase = await createClient();
  
  // Base query: Yahan columns ke exact wahi naam likhe hain jo JSON mein the
  let query = supabase
    .from("appointments")
    .select(`
      id,
      appointment_date,
      time_slot,
      status,
      patient:patients (
        profile:profiles ( full_name )
      ),
      doctor:doctors (
        profile:profiles ( full_name )
      )
    `);

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.patientId) query = query.eq('patient_id', filters.patientId);
  if (filters.doctorId) query = query.eq('doctor_id', filters.doctorId);

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching appointments:", error.message);
    return [];
  }

  const formattedAppointments = data.map((app) => ({
    id: app.id,
    date: app.appointment_date, // JSON se
    time: app.time_slot,        // JSON se
    status: app.status,
    patientName: app.patient?.profile?.full_name || "Unknown Patient",
    doctorName: app.doctor?.profile?.full_name || "Unknown Doctor", // JSON se
  }));

  return formattedAppointments;
}