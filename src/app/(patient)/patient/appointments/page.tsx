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
  
  // 1. Asli loading state banai hai jo track karegi data fetch ho raha hai ya nahi
  const [isLoading, setIsLoading] = useState<boolean>(
    !initialAppointments || initialAppointments.length === 0
  );

  useEffect(() => {
    async function load() {
      let list: PatientAppointment[] = initialAppointments;

      // Agar start mein data nahi hai tou fetch karna shuru karein
      if (!list || list.length === 0) {
        try {
          setIsLoading(true); // Loading on karein
          const data = (await getAppointments()) as PatientAppointment[];
          if (data) list = data;
        } catch (err) {
          console.error("Error fetching appointments:", err);
        }
      }

      // Agar data mil gaya tou prescriptions fetch karein
      if (list && list.length > 0) {
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

      // 2. Data fetch complete, ab loading band kar dein
      setIsLoading(false);
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

  // 3. Ye wrapper list components ko proper loading state pass karega
  const ListWrapper = useCallback(
    (props: any) => <PatientAppointmentList {...props} isLoading={isLoading} />,
    [isLoading]
  );

  return (
    <div className="min-h-screen bg-page p-4 md:p-6">
      <DataContainer
        initialData={appointments}
        HeaderComponent={AppointmentHeader}
        headerProps={headerProps}
        // yahan ListWrapper pass kiya hai taqay DataContainer loading state na roke
        ListComponent={ListWrapper} 
        filterSortLogic={appointmentFilterLogic}
        onEditAction={updateAppointmentAction}
        onDeleteAction={deleteAppointmentAction}
        listPropName="appointments"
      />
    </div>
  );
}