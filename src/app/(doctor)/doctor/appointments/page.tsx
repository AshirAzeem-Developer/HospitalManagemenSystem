"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getAppointments,
  updateAppointmentAction,
  deleteAppointmentAction,
} from "../../../../features/appointments/appointmentActions/appointmentAction";
import { getPrescriptionsByAppointmentIds } from "../../../../features/prescriptions/actions";

import DataContainer, {
  appointmentFilterLogic,
} from "../../../../components/ui/appointmentData";
import AppointmentHeader from "../../../../features/appointments/components/appointmentHeader";
import DoctorAppointmentList from "../../../../features/appointments/components/doctorAppointmentList";

// getAppointments() lives in an untyped .js action file and returns this
// shape (see the formattedAppointments mapping there) — declared here since
// TypeScript can't infer it across the JS/TS boundary.
interface DoctorAppointment {
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
  prescriptionId?: string | null;
}

interface DoctorAppointmentsPageProps {
  initialAppointments?: DoctorAppointment[];
}

export default function DoctorAppointmentsPage({
  initialAppointments = [],
}: DoctorAppointmentsPageProps) {
  const [appointments, setAppointments] =
    useState<DoctorAppointment[]>(initialAppointments);

  useEffect(() => {
    async function load() {
      let list: DoctorAppointment[] = initialAppointments;

      if (!list || list.length === 0) {
        try {
          const data = (await getAppointments()) as DoctorAppointment[];
          if (data) list = data;
        } catch (err) {
          console.error("Error fetching appointments:", err);
          return;
        }
      }

      if (!list || list.length === 0) return;

      // Attach prescriptionId (or null) to each appointment so the list
      // can show View+Edit vs Create without a per-row round trip.
      const ids = list.map((a) => a.id).filter(Boolean);
      const statusResult = await getPrescriptionsByAppointmentIds(ids);
      const statusMap: Record<string, string> = statusResult.success
        ? (statusResult.data as Record<string, string>)
        : {};

      const merged: DoctorAppointment[] = list.map((appointment) => ({
        ...appointment,
        prescriptionId: statusMap[appointment.id] ?? null,
      }));

      setAppointments(merged);
    }

    load();
    // Intentionally run once on mount — initialAppointments is expected to
    // be stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerProps = useMemo(
    () => ({
      title: "My Appointments",
      showNewButton: false,
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-page p-4 md:p-6">
      <DataContainer
        initialData={appointments}
        HeaderComponent={AppointmentHeader}
        headerProps={headerProps}
        ListComponent={DoctorAppointmentList}
        filterSortLogic={appointmentFilterLogic}
        onEditAction={updateAppointmentAction}
        onDeleteAction={deleteAppointmentAction}
        listPropName="appointments"
      />
    </div>
  );
}
