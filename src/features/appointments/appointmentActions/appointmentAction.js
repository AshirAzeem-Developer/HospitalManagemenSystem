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

// 4. Server Action file (Backend)

export async function getAppointments(filters = {}) {
  const supabase = await createClient();
  
  // NEW LOGIC: AUTO-CANCEL PAST APPOINTMENTS
  const todayStr = new Date().toISOString().split('T')[0]; 

  const { error: cancelError } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .lt("appointment_date", todayStr) 
    .eq("status", "pending"); 

  if (cancelError) {
    console.error("Error auto-cancelling past appointments:", cancelError.message);
  }
  // ==========================================

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

// 5. UPDATE APPOINTMENT (Profiles table ke name ke sath)
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

  // Patient profile_id update
  if (updatedData.patientName && appData?.patient?.profile_id) {
    await supabase
      .from("profiles")
      .update({ full_name: updatedData.patientName })
      .eq("id", appData.patient.profile_id);
  }

  // Doctor profile_id update
  if (updatedData.doctorName && appData?.doctor?.profile_id) {
    await supabase
      .from("profiles")
      .update({ full_name: updatedData.doctorName })
      .eq("id", appData.doctor.profile_id);
  }

  // 4. Ab appointments table mein Date, Time, Status aur DOCTOR ID update 
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

  // Agar frontend se patientId nahi aaya (yani Patient khud form fill kar raha hai)
  if (!finalPatientId) {
    // 1. Logged-in user ka session get karein
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: "User not authenticated." };
    }

    // 2. Auth user_id ke zariye 'patients' table se patient ki real ID nikalien
    const { data: patientRecord, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (patientError || !patientRecord) {
      console.error("Patient profile not found:", patientError?.message);
      return { success: false, message: "Patient profile not found." };
    }

    // 3. ID ko finalPatientId mein set kar dein
    finalPatientId = patientRecord.id;
  }

  const insertPayload = {
    patient_id: finalPatientId, // Backend ne secure way mein ID yahan dal di
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

  // Cache paths ko refresh karein dono dashboard ke liye
  revalidatePath("/admin/appointments"); 
  revalidatePath("/patient/appointments"); 
  
  return { success: true, message: "Appointment created successfully!" };
}

// 8. UPDATE ONLY APPOINTMENT STATUS (For Prescriptions etc)
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

  // Paths ko refresh kar dein taake frontend par status update nazar aaye
  revalidatePath("/doctor/appointments");
  revalidatePath("/admin/appointments");
  
  return { success: true, message: "Status updated successfully!" };
}