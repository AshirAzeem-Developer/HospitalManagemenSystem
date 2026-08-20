"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getAppointments,
  updateAppointmentAction,
  deleteAppointmentAction,
} from "../../../../features/appointments/appointmentActions/appointmentAction";
import { getPrescriptionsByAppointmentIds } from "../../../../features/prescriptions/actions";
import { Card } from "@/components/ui/card";
import DataContainer, {
  appointmentFilterLogic,
} from "../../../../components/ui/appointmentData";
import AppointmentHeader from "../../../../features/appointments/components/appointmentHeader";
import PatientAppointmentList from "../../../../features/appointments/components/patientAppointmentList";

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
  prescriptionId?: string | null;
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
    async function load() {
      let list: PatientAppointment[] = initialAppointments;

      if (!list || list.length === 0) {
        try {
          const data = (await getAppointments()) as PatientAppointment[];
          if (data) list = data;
        } catch (err) {
          console.error("Error fetching appointments:", err);
          return;
        }
      }

      if (!list || list.length === 0) return;

      const ids = list.map((a) => a.id).filter(Boolean);
      const statusResult = await getPrescriptionsByAppointmentIds(ids);
      const statusMap: Record<string, string> = statusResult.success
        ? (statusResult.data as Record<string, string>)
        : {};

      const merged: PatientAppointment[] = list.map((appointment) => ({
        ...appointment,
        prescriptionId: statusMap[appointment.id] ?? null,
      }));

      setAppointments(merged);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerProps = useMemo(
    () => ({
      title: "My Appointments",
      newAppointmentUrl: "/patient/appointments/book",
    }),
    [],
  );

  return (
    <div>
<h1 className="text-xl font-semibold text-slate-900 dark:text-white">My Appointments</h1>   
   <p className="mt-1 text-sm text-slate-500">Book and view your upcoming medical appointments.</p>
      <div className="mt-6">
        <Card label="Upcoming Visits" value="0" hint="Wired up in feature update" />
      </div>
    </div>
  );
}