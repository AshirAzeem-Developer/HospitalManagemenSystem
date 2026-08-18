import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import Button from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import {
  getAppointments,
  getDoctors,
} from "@/features/appointments/appointmentActions/appointmentAction";

import {
  getInvoicesAction,
  getInvoiceItemsByInvoiceIdAction,
} from "@/features/billing/actions";

import { getPatientDetail } from "@/features/patients/actions";

import StatsGrid from "@/features/patients/dashboard/StatsGrid";
import VitalsCard from "@/features/patients/dashboard/VitalsCard";
import MyDoctorsCard from "@/features/patients/dashboard/MyDoctorsCard";
import PrescriptionsCard from "@/features/patients/dashboard/PrescriptionsCard";
import RecentActivityCard from "@/features/patients/dashboard/RecentActivityCard";
import ConsultationByDepartment from "@/features/patients/dashboard/ConsultationByDepartment";
import RecentTransactions from "@/features/patients/dashboard/RecentTransactions";
import PatientDashboardAppointments from "@/features/patients/dashboard/PatientDashboardAppointments";

export default async function PatientDashboardPage() {
  const supabase = await createClient();

  // -----------------------------------
  // Logged-in user
  // -----------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  // -----------------------------------
  // Auth user -> patients.id
  // -----------------------------------

  const { data: patientRecord, error: patientError } = await supabase
    .from("patients")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (patientError || !patientRecord) {
    console.error("PATIENT RECORD ERROR:", patientError);

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Patient profile not found.
        </p>
      </div>
    );
  }

  const patientId = patientRecord.id;

  // -----------------------------------
  // Patient + appointments + doctors + invoices
  // -----------------------------------

  const [patient, myAppointments, allDoctors, allInvoices] =
    await Promise.all([
      getPatientDetail(patientId),
      getAppointments({ patientId }),
      getDoctors(),
      getInvoicesAction(),
    ]);

  // -----------------------------------
  // Patient's doctors
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
  // Patient's invoices
  // invoices table uses patient_id
  // -----------------------------------

  const myInvoices = (allInvoices || []).filter(
    (invoice: any) => invoice.patient_id === patientId
  );

  // -----------------------------------
  // Debug
  // -----------------------------------

  console.log("=================================");
  console.log("CURRENT PATIENT ID:", patientId);

  console.log(
    "ALL INVOICES:",
    (allInvoices || []).map((invoice: any) => ({
      invoice_number: invoice.invoice_number,
      patient_id: invoice.patient_id,
      appointment_id: invoice.appointment_id,
      total: invoice.total,
      status: invoice.status,
    }))
  );

  console.log("MY INVOICES:", myInvoices);

  // -----------------------------------
  // Prescriptions
  // -----------------------------------

  const {
    data: prescriptions,
    error: prescriptionError,
  } = await supabase
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
      "ERROR FETCHING PRESCRIPTIONS:",
      prescriptionError.message
    );
  }

  const latestPrescription = prescriptions?.[0] || null;

  // -----------------------------------
  // Recent invoices
  // -----------------------------------

  const recentInvoices = [...myInvoices]
    .sort((a: any, b: any) => {
      const dateA = new Date(a.issued_date).getTime();
      const dateB = new Date(b.issued_date).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  // -----------------------------------
  // Attach invoice items
  // -----------------------------------

  const invoicesWithItems = await Promise.all(
    recentInvoices.map(async (invoice: any) => {
      const items = await getInvoiceItemsByInvoiceIdAction(
        invoice.id
      );

      return {
        ...invoice,
        items,
      };
    })
  );

  // -----------------------------------
  // Consultation By Department
  // -----------------------------------

 // -----------------------------------
// Consultation By Department
// -----------------------------------

const departmentMap: Record<
  string,
  {
    department: string;
    current: number;
    previous: number;
  }
> = {};

myAppointments.forEach((appointment: any) => {
  const doctor = myDoctors.find(
    (doctor: any) => String(doctor.id) === String(appointment.doctorId)
  );

  const department = doctor?.specialization || "General";

  if (!departmentMap[department]) {
    departmentMap[department] = {
      department,
      current: 0,
      previous: 0,
    };
  }

  departmentMap[department].current += 1;
});

const departmentData = Object.values(departmentMap);

  // -----------------------------------
  // Recent Transactions
  // -----------------------------------

  const recentTransactions = invoicesWithItems.map(
    (invoice: any) => {
      const appointment = invoice.appointment_id
        ? myAppointments.find(
            (appointment: any) =>
              appointment.id === invoice.appointment_id
          )
        : null;

      const doctor = appointment
        ? myDoctors.find(
            (doctor: any) =>
              doctor.id === appointment.doctorId
          )
        : null;

      const firstItem = invoice.items?.[0];

      return {
        id: invoice.id,

        invoice_number: invoice.invoice_number,

        doctor_name:
          doctor?.name || "Walk-in / Direct",

        specialty:
          doctor?.specialty ||
          firstItem?.description ||
          firstItem?.item_description ||
          "",

        label:
          firstItem?.item_name ||
          firstItem?.itemName ||
          "Invoice",

        amount: Number(invoice.total) || 0,

        avatar_url: doctor?.avatar_url || null,

        status: invoice.status,
      };
    }
  );

  console.log("RECENT TRANSACTIONS:", recentTransactions);

  // -----------------------------------
  // Dashboard
  // -----------------------------------

  return (
    <div className="space-y-6">

      {/* Heading */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <h1 className="text-xl font-semibold text-slate-900">
    Patient Dashboard
  </h1>

  <Link href="/patient/appointments/book">
    <Button
      variant="primary"
      text="New Appointment"
      icon={<FiPlus />}
    />
  </Link>
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
    
      {/* Vitals */}

      <VitalsCard
        weight={latestPrescription?.weight}
        height={latestPrescription?.height}
        pulse={latestPrescription?.pulse_rate}
        spo2={latestPrescription?.spo2}
        temperature={latestPrescription?.temperature}
      />
      {/* Consultation + Transactions */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        <ConsultationByDepartment
          departmentData={departmentData}
        />

        <RecentTransactions
          transactions={recentTransactions}
        />

      </div>
{/* Patient Appointments */}

<div className="space-y-4">
 
  <PatientDashboardAppointments
    appointments={myAppointments}
    doctorsList={allDoctors}
  />
</div>
    </div>
    
  );
}

