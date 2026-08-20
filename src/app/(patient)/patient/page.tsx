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
 
  const {
    data: { user },
  } = await supabase.auth.getUser();
 
  if (!user) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }
 
  const { data: patientRecord, error: patientError } = await supabase
    .from("patients")
    .select("id")
    .eq("profile_id", user.id)
    .single();
 
  if (patientError || !patientRecord) {
    console.error("PATIENT RECORD ERROR:", patientError);
 
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Patient profile not found.
        </p>
      </div>
    );
  }
 
  const patientId = patientRecord.id;
 
  const [patient, myAppointments, allDoctors, allInvoices] =
    await Promise.all([
      getPatientDetail(patientId),
      getAppointments({ patientId }),
      getDoctors(),
      getInvoicesAction(),
    ]);
 
  const doctorIds = [
    ...new Set(
      myAppointments
        .map((appointment: any) => appointment.doctorId)
        .filter(Boolean)
    ),
  ];
 
  const myDoctors = (allDoctors || [])
  .filter((doctor: any) => doctorIds.includes(doctor.id))
  .map((doctor: any) => ({
    ...doctor,
    bookings_count: myAppointments.filter(
      (appointment: any) =>
        String(appointment.doctorId) === String(doctor.id)
    ).length,
  }));
 
  const myInvoices = (allInvoices || []).filter(
    (invoice: any) => invoice.patient_id === patientId
  );
 
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
 
  const recentInvoices = [...myInvoices]
    .sort((a: any, b: any) => {
      const dateA = new Date(a.issued_date).getTime();
      const dateB = new Date(b.issued_date).getTime();
 
      return dateB - dateA;
    })
    .slice(0, 5);
 
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
 
 const departmentMap: Record<
  string,
  {
    department: string;
    current: number;
    previous: number;
  }
> = {};
 
const now = new Date();
 
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
 
const previousDate = new Date(
  currentYear,
  currentMonth - 1,
  1
);
 
const previousYear = previousDate.getFullYear();
const previousMonth = previousDate.getMonth();
 
myAppointments.forEach((appointment: any) => {
  const doctorId =
    appointment.doctorId ??
    appointment.doctor_id;
 
  const doctor = myDoctors.find(
    (doctor: any) =>
      String(doctor.id) === String(doctorId)
  );
 
  const department =
    doctor?.specialization || "General";
 
  if (!departmentMap[department]) {
    departmentMap[department] = {
      department,
      current: 0,
      previous: 0,
    };
  }
 
  // IMPORTANT:
  // getAppointments() mein date kis naam se aa rahi hai
  const rawDate =
    appointment.appointment_date ??
    appointment.appointmentDate ??
    appointment.date;
 
  if (!rawDate) {
    console.log("NO APPOINTMENT DATE:", appointment);
    return;
  }
 
  // YYYY-MM-DD ko directly split karna safer hai
  const [year, month] = String(rawDate)
    .slice(0, 10)
    .split("-")
    .map(Number);
 
  const appointmentYear = year;
  const appointmentMonth = month - 1;
 
  if (
    appointmentYear === currentYear &&
    appointmentMonth === currentMonth
  ) {
    departmentMap[department].current += 1;
  }
 
  if (
    appointmentYear === previousYear &&
    appointmentMonth === previousMonth
  ) {
    departmentMap[department].previous += 1;
  }
});
 
const departmentData = Object.values(departmentMap);
 
console.log("MY APPOINTMENTS:", myAppointments);
console.log("DEPARTMENT DATA:", departmentData);
 
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
 
  return (
    <div className="space-y-6 dark:text-gray-100">
      {/* Heading */}
 
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
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