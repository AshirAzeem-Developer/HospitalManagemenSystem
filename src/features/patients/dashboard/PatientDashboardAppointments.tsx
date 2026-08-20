
"use client";

import PatientAppointmentList from "@/features/appointments/components/patientAppointmentList";

type PatientDashboardAppointmentsProps = {
  appointments: any[];
  doctorsList: any[];
};

const PatientAppointmentListTyped =
  PatientAppointmentList as React.ComponentType<{
    appointments?: any[];
    doctorsList?: any[];
    onEdit?: (appointment: any) => void;
  }>;

export default function PatientDashboardAppointments({
  appointments,
  doctorsList,
}: PatientDashboardAppointmentsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        My Appointments
      </h2>

      <PatientAppointmentListTyped
        appointments={appointments}
        doctorsList={doctorsList}
      />
    </div>
  );
}

