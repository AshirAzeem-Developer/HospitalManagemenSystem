"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  getAppointments, 
  updateAppointmentAction, 
  deleteAppointmentAction 
} from "../../../../features/appointments/appointmentActions/appointmentAction"; 

import DataContainer, { appointmentFilterLogic } from '../../../../components/ui/appointmentData';
import AppointmentHeader from "../../../../features/appointments/components/appointmentHeader"; 
import PatientAppointmentList from "../../../../features/appointments/components/patientAppointmentList"; 

export default function PatientAppointmentsPage({ initialAppointments = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);

  useEffect(() => {
    if (!initialAppointments || initialAppointments.length === 0) {
      getAppointments()
        .then((data) => {
          if (data) setAppointments(data);
        })
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, []); 

  const headerProps = useMemo(() => ({
    title: "My Appointments", 
    newAppointmentUrl: "/patient/appointments/book"
  }), []);

  return (
    <div className="min-h-screen bg-[#F5F6F8] p-4 md:p-6">
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