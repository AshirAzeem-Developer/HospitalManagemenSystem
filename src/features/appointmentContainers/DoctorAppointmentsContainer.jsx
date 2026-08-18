"use client";

import DataContainer, { appointmentFilterLogic } from '../../components/ui/appointmentData';
import AppointmentHeader from '../appointments/components/appointmentHeader';
import DoctorAppointmentList from '../appointments/components/doctorAppointmentList';
import { updateAppointmentAction, deleteAppointmentAction } from '../appointments/appointmentActions/appointmentAction';

export default function DoctorAppointmentsContainer({
  initialAppointments = [],
}) {
  const headerProps = {
    title: "My Appointments",
    showNewButton: false,
  };

  return (
    <DataContainer
      initialData={initialAppointments}
      HeaderComponent={AppointmentHeader}
      headerProps={headerProps}
      ListComponent={DoctorAppointmentList}
      filterSortLogic={appointmentFilterLogic}
      onEditAction={updateAppointmentAction}
      onDeleteAction={deleteAppointmentAction}
      listPropName="appointments"
    />
  );
}