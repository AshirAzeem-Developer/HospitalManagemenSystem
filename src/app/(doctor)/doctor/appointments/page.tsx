"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  getAppointments, 
  updateAppointmentAction, 
  deleteAppointmentAction 
} from "../../../../features/appointments/appointmentActions/appointmentAction"; 

import DataContainer, { appointmentFilterLogic } from '../../../../components/ui/appointmentData';
import AppointmentHeader from "../../../../features/appointments/components/appointmentHeader"; 
import DoctorAppointmentList from "../../../../features/appointments/components/doctorAppointmentList"; 

export default function DoctorAppointmentsPage({ initialAppointments = [] }) {
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
    showNewButton: false 
  }), []);

  return (
    <div className="min-h-screen bg-[#F5F6F8] p-4 md:p-6">
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