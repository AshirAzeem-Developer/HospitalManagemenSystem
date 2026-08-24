import { createClient } from "@/lib/supabase/server";
 
import type { Profile } from "./types";
 
export async function getCurrentUserProfile(): Promise<{
  profile: Profile | null;
  email: string;
}> {
  const supabase = await createClient();
 
  const {
    data: { user },
  } = await supabase.auth.getUser();
 
  if (!user) {
    return { profile: null, email: "" };
  }
 
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
 
  if (error) {
    console.error("getCurrentUserProfile error:", error.message);
  }
 
  return {
    profile: profile as Profile | null,
    email: user.email ?? "",
  };
}
 
// Admin Dashboard Stats
export async function getAdminDashboardStats() {
  const supabase = await createClient();
 
  const [
    doctorsResult,
    patientsResult,
    appointmentsResult,
    invoicesResult,
  ] = await Promise.all([
    supabase
      .from("doctors")
      .select("id", { count: "exact", head: true }),
 
    supabase
      .from("patients")
      .select("id", { count: "exact", head: true }),
 
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true }),
 
    supabase
      .from("invoices")
      .select("total"),
  ]);
 
  if (doctorsResult.error) {
    console.error(
      "Error fetching doctors count:",
      doctorsResult.error.message
    );
  }
 
  if (patientsResult.error) {
    console.error(
      "Error fetching patients count:",
      patientsResult.error.message
    );
  }
 
  if (appointmentsResult.error) {
    console.error(
      "Error fetching appointments count:",
      appointmentsResult.error.message
    );
  }
 
  if (invoicesResult.error) {
    console.error(
      "Error fetching invoices:",
      invoicesResult.error.message
    );
  }
 
  const totalRevenue = (invoicesResult.data ?? []).reduce(
    (sum, invoice) => sum + Number(invoice.total ?? 0),
    0
  );
 
  return {
    totalDoctors: doctorsResult.count ?? 0,
    totalPatients: patientsResult.count ?? 0,
    totalAppointments: appointmentsResult.count ?? 0,
    totalRevenue,
  };
}
// Appointment Statistics for Admin Dashboard
export async function getAppointmentStatistics() {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("appointments")
    .select("status, appointment_date");
 
  if (error) {
    console.error(
      "Error fetching appointment statistics:",
      error.message
    );
 
    return {
      cancelled: 0,
      completed: 0,
      confirmed: 0,
      pending: 0,
      monthlyData: [],
    };
  }
 
  const currentYear = new Date().getFullYear();
 
  const stats = {
    cancelled: 0,
    completed: 0,
    confirmed: 0,
    pending: 0,
  };
 
  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(currentYear, index, 1).toLocaleString("en-US", {
      month: "short",
    }),
    cancelled: 0,
    completed: 0,
    confirmed: 0,
    pending: 0,
  }));
 
  data.forEach((appointment) => {
    const status = appointment.status?.toLowerCase();
 
    if (status === "cancelled") {
      stats.cancelled++;
 
      if (appointment.appointment_date) {
        const date = new Date(appointment.appointment_date);
 
        if (date.getFullYear() === currentYear) {
          monthlyData[date.getMonth()].cancelled++;
        }
      }
    }
 
    if (status === "completed") {
      stats.completed++;
 
      if (appointment.appointment_date) {
        const date = new Date(appointment.appointment_date);
 
        if (date.getFullYear() === currentYear) {
          monthlyData[date.getMonth()].completed++;
        }
      }
    }
 
    if (status === "confirmed") {
      stats.confirmed++;
 
      if (appointment.appointment_date) {
        const date = new Date(appointment.appointment_date);
 
        if (date.getFullYear() === currentYear) {
          monthlyData[date.getMonth()].confirmed++;
        }
      }
    }
 
    if (status === "pending") {
      stats.pending++;
 
      if (appointment.appointment_date) {
        const date = new Date(appointment.appointment_date);
 
        if (date.getFullYear() === currentYear) {
          monthlyData[date.getMonth()].pending++;
        }
      }
    }
  });
 
  return {
    ...stats,
    monthlyData,
  };
}