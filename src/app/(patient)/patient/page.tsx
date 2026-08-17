import { createClient } from "@/lib/supabase/server";
import {
  getAppointments,
  getDoctors,
} from "@/features/appointments/appointmentActions/appointmentAction";
import { getInvoicesAction } from "@/features/billing/actions";
import { getPatientDetail } from "@/features/patients/actions";

import StatsGrid from "@/features/patients/dashboard/StatsGrid";
import MyDoctorsCard from "@/features/patients/dashboard/MyDoctorsCard";
import PrescriptionsCard from "@/features/patients/dashboard/PrescriptionsCard";
import RecentActivityCard from "@/features/patients/dashboard/RecentActivityCard";

export default async function PatientDashboardPage() {
  const supabase = await createClient();

  // Logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth user -> patients.id
  const { data: patientRecord } = user
    ? await supabase
        .from("patients")
        .select("id")
        .eq("profile_id", user.id)
        .single()
    : { data: null };

  const patientId = patientRecord?.id;

  if (!patientId) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Patient profile not found.
        </p>
      </div>
    );
  }

  // -----------------------------------
  // Patient data + appointments + invoices + doctors
  // -----------------------------------

  const [patient, myAppointments, allInvoices, allDoctors] =
    await Promise.all([
      getPatientDetail(patientId),
      getAppointments({ patientId }),
      getInvoicesAction(),
      getDoctors(),
    ]);

  // -----------------------------------
  // Patient's invoices only
  // -----------------------------------

  const myInvoices = (allInvoices || []).filter(
    (invoice: any) =>
      invoice.patient_id === patientId ||
      invoice.patients?.id === patientId
  );

  // -----------------------------------
  // Patient's doctors only
  // -----------------------------------

  const doctorIds = [
    ...new Set(
      myAppointments
        .map((appointment: any) => appointment.doctorId)
        .filter(Boolean)
    ),
  ];

  const myDoctors = (allDoctors || []).filter((doctor: any) =>
    doctorIds.includes(doctor.id)
  );

  // -----------------------------------
  // Real prescriptions
  // -----------------------------------

  const { data: prescriptions, error: prescriptionError } =
    await supabase
      .from("prescriptions")
      .select(`
        id,
        appointment_id,
        patient_id,
        temperature,
        pulse_rate,
        weight,
        height,
        spo2,
        advice,
        created_at,
        prescription_items (
          id,
          medicine_name,
          dosage,
          frequency,
          duration,
          timing,
          instructions
        )
      `)
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

  if (prescriptionError) {
    console.error(
      "Error fetching prescriptions:",
      prescriptionError.message
    );
  }

  // -----------------------------------
  // Debug logs
  // -----------------------------------

  console.log("CURRENT PATIENT ID:", patientId);
  console.log("MY APPOINTMENTS:", myAppointments);
  console.log("MY DOCTORS:", myDoctors);
  console.log("PRESCRIPTIONS:", prescriptions);
  console.log("MY INVOICES:", myInvoices);

  // -----------------------------------
  // Dashboard
  // -----------------------------------

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <StatsGrid
        totalAppointments={myAppointments.length}
        totalConsultations={myAppointments.length}
        vitals={patient?.vitals}
      />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MyDoctorsCard doctors={myDoctors} />

        <PrescriptionsCard
          prescriptions={prescriptions || []}
        />

        <RecentActivityCard
          appointments={myAppointments}
          invoices={myInvoices}
        />
      </div>
    </div>
  );
}