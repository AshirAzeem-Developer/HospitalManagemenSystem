"use client";

import DataContainer, { appointmentFilterLogic } from '@/components/ui/appointmentData';
import AppointmentHeader from '../appointments/components/appointmentHeader';
import AppointmentsList from '../appointments/components/appointmentList';
import { updateAppointmentAction, deleteAppointmentAction } from '../appointments/appointmentActions/appointmentAction';

export default function AppointmentsContainer({ 
  initialAppointments = [],
  doctorsList = [], 
  showNewButton = true, 
  newAppointmentUrl = "/admin/appointments/new" 
}) {
  return (
    <DataContainer
      initialData={initialAppointments}
      HeaderComponent={AppointmentHeader}
      headerProps={{ showNewButton, newAppointmentUrl }} 
      ListComponent={AppointmentsList}
      listComponentProps={{ doctorsList: doctorsList }} 
      filterSortLogic={appointmentFilterLogic}
      onEditAction={updateAppointmentAction}
      onDeleteAction={deleteAppointmentAction}
      listPropName="appointments"
    />
  );
}