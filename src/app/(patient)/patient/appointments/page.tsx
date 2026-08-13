"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getAppointments,
  updateAppointmentAction,
  deleteAppointmentAction,
} from "../../../../features/appointments/appointmentActions/appointmentAction";

import DataContainer, {
  appointmentFilterLogic,
} from "../../../../components/ui/appointmentData";
import AppointmentHeader from "../../../../features/appointments/components/appointmentHeader";
import PatientAppointmentList from "../../../../features/appointments/components/patientAppointmentList";

// Same shape getAppointments() returns for the doctor page — see
// appointmentAction.js's formattedAppointments mapping.
interface PatientAppointment {
  id: string;
  date: string;
  time: string;
  status: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  patientImage: string;
  doctorName: string;
  doctorImage: string;
}

interface PatientAppointmentsPageProps {
  initialAppointments?: PatientAppointment[];
}

export default function PatientAppointmentsPage({
  initialAppointments = [],
}: PatientAppointmentsPageProps) {
  const [appointments, setAppointments] = useState<PatientAppointment[]>(
    initialAppointments,
  );

useEffect(() => {
    if (!initialAppointments || initialAppointments.length === 0) {
      getAppointments()
        .then((data: PatientAppointment[]) => {
          if (data) setAppointments(data);
        })
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, []);

  const headerProps = useMemo(
    () => ({
      title: "My Appointments",
      newAppointmentUrl: "/patient/appointments/book",
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-page p-4 md:p-6">
      <DataContainer
        initialData={appointments}
        HeaderComponent={AppointmentHeader}
        headerProps={headerProps}
        ListComponent={PatientAppointmentList}
        filterSortLogic={appointmentFilterLogic}
        onEditAction={updateAppointmentAction}
        onDeleteAction={deleteAppointmentAction}
        listPropName="appointments"
      />
    </div>
  );
}