"use client";

import DataContainer, { appointmentFilterLogic } from '@/components/ui/appointmentData';
import AppointmentHeader from '../appointments/components/appointmentHeader';
import PatientAppointmentList from '../appointments/components/patientAppointmentList';
import { updateAppointmentAction, deleteAppointmentAction } from '../appointments/appointmentActions/appointmentAction';

export default function PatientAppointmentsContainer({
  initialAppointments = [],
  doctorsList = [],
  newAppointmentUrl = "/patient/appointments/book",
}) {
  const headerProps = {
    title: "My Appointments",
    newAppointmentUrl,
  };

  return (
    <DataContainer
      initialData={initialAppointments}
      HeaderComponent={AppointmentHeader}
      headerProps={headerProps}
      ListComponent={PatientAppointmentList}
      listComponentProps={{ doctorsList }}
      filterSortLogic={appointmentFilterLogic}
      onEditAction={updateAppointmentAction}
      onDeleteAction={deleteAppointmentAction}
      listPropName="appointments"
    />
  );
}