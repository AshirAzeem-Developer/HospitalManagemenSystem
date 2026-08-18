"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(
    initialAppointments,
  );
  
  // 1. Loading state setup
  const [isLoading, setIsLoading] = useState<boolean>(
    !initialAppointments || initialAppointments.length === 0
  );

  useEffect(() => {
    async function load() {
      let list: DoctorAppointment[] = initialAppointments;

      if (!list || list.length === 0) {
        try {
          setIsLoading(true); // Loading Start
          const data = (await getAppointments()) as DoctorAppointment[];
          if (data) list = data;
        } catch (err) {
          console.error("Error fetching appointments:", err);
          setIsLoading(false);
          return;
        }
      }

      if (!list || list.length === 0) {
        setIsLoading(false); // Agar sach mein data nahi aya toh band karein
        return;
      }

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
      setIsLoading(false); // Data ready, Loading Stop
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerProps = useMemo(
    () => ({
      title: "My Appointments",
      showNewButton: false,
    }),
    [],
  );

  // 2. DataContainer ko Loading state pass karne ke liye Wrapper
  const ListWrapper = useCallback(
    (props: any) => <DoctorAppointmentList {...props} isLoading={isLoading} />,
    [isLoading]
  );

  return (
    <div className="min-h-screen bg-page p-4 md:p-6">
      <DataContainer
        initialData={appointments}
        HeaderComponent={AppointmentHeader}
        headerProps={headerProps}
        ListComponent={ListWrapper} // 3. Yahan use kiya hai
        filterSortLogic={appointmentFilterLogic}
        onEditAction={updateAppointmentAction}
        onDeleteAction={deleteAppointmentAction}
        listPropName="appointments"
      />
    </div>
  );
}