"use client";

import DataContainer, { appointmentFilterLogic } from '@/components/ui/appointmentData';
import AppointmentHeader from './appointmentHeader';
import AppointmentsList from './appointmentList';
import { updateAppointmentAction, deleteAppointmentAction } from '../appointmentActions/appointmentAction';

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