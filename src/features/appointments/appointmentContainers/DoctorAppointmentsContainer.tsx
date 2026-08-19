"use client";

import DataContainer, { appointmentFilterLogic } from '@/components/ui/appointmentData';
import AppointmentHeader from '../components/appointmentHeader';
import DoctorAppointmentList from '../components/doctorAppointmentList';
import { updateAppointmentAction, deleteAppointmentAction } from '../appointmentActions/appointmentAction';
import type { Appointment } from '@/app/(doctor)/doctor/appointments/page';

interface DoctorAppointmentsContainerProps {
  initialAppointments?: Appointment[];
}

export default function DoctorAppointmentsContainer({
  initialAppointments = [],
}: DoctorAppointmentsContainerProps) {
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