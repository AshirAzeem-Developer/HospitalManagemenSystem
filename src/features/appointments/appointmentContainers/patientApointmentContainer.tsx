"use client";

import DataContainer, { appointmentFilterLogic } from '@/components/ui/appointmentData';
import AppointmentHeader from '../components/appointmentHeader';
import PatientAppointmentList from '../components/patientAppointmentList';
import { updateAppointmentAction, deleteAppointmentAction } from '../appointmentActions/appointmentAction';
import type { Appointment } from '@/app/(patient)/patient/appointments/page';

interface Doctor {
  id?: string | number;
  _id?: string | number;
  name?: string;
  profile?: { full_name?: string };
  [key: string]: unknown;
}

interface PatientAppointmentsContainerProps {
  initialAppointments?: Appointment[];
  doctorsList?: Doctor[];
  newAppointmentUrl?: string;
}

export default function PatientAppointmentsContainer({
  initialAppointments = [],
  doctorsList = [],
  newAppointmentUrl = "/patient/appointments/book",
}: PatientAppointmentsContainerProps) {
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