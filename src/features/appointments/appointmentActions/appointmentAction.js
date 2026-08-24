"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
  
  const { data, error } = await supabase
    .from("doctors")
    .select(`
      *,
      profile:profiles (
        full_name,
        avatar_url
      )
    `); 
  
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

// 4. Server Action file (Backend) - Fetch Appointments
export async function getAppointments(filters = {}) {
  const supabase = await createClient();
  
  // AUTO-CANCEL PAST APPOINTMENTS
  const todayStr = new Date().toISOString().split('T')[0]; 

  const { error: cancelError } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .lt("appointment_date", todayStr) 
    .eq("status", "pending"); 

  if (cancelError) {
    console.error("Error auto-cancelling past appointments:", cancelError.message);
  }

  let query = supabase
    .from("appointments")
    .select(`
      id,
      appointment_date,
      time_slot,
      reason_of_visit,
      status,
      patient_id,
      doctor_id,
      patient:patients (
        profile:profiles ( full_name, avatar_url ) 
      ),
      doctor:doctors (
        profile:profiles ( full_name, avatar_url ) 
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
    date: app.appointment_date, 
    time: app.time_slot, 
    reasonOfVisit: app.reason_of_visit,       
    status: app.status,
    patientId: app.patient_id,
    doctorId: app.doctor_id,
    reason: app.reason_of_visit, 
    patientName: app.patient?.profile?.full_name || "Unknown Patient",
    patientImage: app.patient?.profile?.avatar_url || "/default-avatar.png", 
    doctorName: app.doctor?.profile?.full_name || "Unknown Doctor",
    doctorImage: app.doctor?.profile?.avatar_url || "/default-avatar.png", 
  }));

  return formattedAppointments;
}

// 5. UPDATE APPOINTMENT
export async function updateAppointmentAction(id, updatedData) {
  const supabase = await createClient();

  const { data: appData, error: fetchError } = await supabase
    .from("appointments")
    .select(`
      patient:patients ( profile_id ),
      doctor:doctors ( profile_id )
    `)
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching profile IDs:", fetchError.message);
  }

  if (updatedData.patientName && appData?.patient?.profile_id) {
    await supabase
      .from("profiles")
      .update({ full_name: updatedData.patientName })
      .eq("id", appData.patient.profile_id);
  }

  if (updatedData.doctorName && appData?.doctor?.profile_id) {
    await supabase
      .from("profiles")
      .update({ full_name: updatedData.doctorName })
      .eq("id", appData.doctor.profile_id);
  }

  const updatePayload = {
    appointment_date: updatedData.date,
    time_slot: updatedData.time,
    status: updatedData.status,
    doctor_id: updatedData.doctorId, 
  };

  const { error: appError } = await supabase
    .from("appointments")
    .update(updatePayload)
    .eq("id", id);

  if (appError) {
    console.error("Error updating appointment:", appError.message);
    return { success: false, message: appError.message };
  }

  revalidatePath("/admin/appointments"); 
  return { success: true, message: "Appointment and Profiles updated successfully!" };
}

// 6. DELETE APPOINTMENT
export async function deleteAppointmentAction(id) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting appointment:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/appointments");
  return { success: true, message: "Appointment deleted successfully!" };
}

// 7. CREATE NEW APPOINTMENT
export async function createAppointmentAction(appointmentData) {
  const supabase = await createClient();

  let finalPatientId = appointmentData.patientId;

  if (!finalPatientId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: "User not authenticated." };
    }

    const { data: patientRecord, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (patientError || !patientRecord) {
      console.error("Patient profile not found:", patientError?.message);
      return { success: false, message: "Patient profile not found." };
    }

    finalPatientId = patientRecord.id;
  }

  const insertPayload = {
    patient_id: finalPatientId,
    doctor_id: appointmentData.doctorId,
    appointment_date: appointmentData.date,
    time_slot: appointmentData.time,
    status: appointmentData.status || 'pending',
    reason_of_visit: appointmentData.reason 
  };

  const { error } = await supabase
    .from("appointments")
    .insert([insertPayload]);

  if (error) {
    console.error("Error creating appointment:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/appointments"); 
  revalidatePath("/patient/appointments"); 
  
  return { success: true, message: "Appointment created successfully!" };
}

// 8. UPDATE ONLY APPOINTMENT STATUS
export async function updateAppointmentStatusAction(id, newStatus) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("appointments")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    console.error("Error updating appointment status:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/doctor/appointments");
  revalidatePath("/admin/appointments");
  
  return { success: true, message: "Status updated successfully!" };
}

// 9. GET ACTIVE DOCTOR SCHEDULES
export async function getDoctorSchedule(doctorId) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("doctor_schedules")
    .select("id, doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_active")
    .eq("doctor_id", doctorId)
    .eq("is_active", true); // Only active schedules

  if (error) {
    console.error("Error fetching doctor schedule:", error.message);
    return [];
  }
  return data;
}