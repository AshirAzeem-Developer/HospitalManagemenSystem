"use client";

import DataContainer, {
  appointmentFilterLogic,
  Appointment,
} from "@/components/ui/appointmentData";

import AppointmentHeader from "./appointmentHeader";
import AppointmentsList from "./appointmentList";

import {
  updateAppointmentAction,
  deleteAppointmentAction,
} from "../appointmentActions/appointmentAction";

// interface Appointment {
//   id: string;
//   date: string;
//   time: string;
//   reasonOfVisit?: string | null;
//   status: string;
//   patientId: string;
//   doctorId: string;
//   patientName: string;
//   patientImage: string;
//   doctorName: string;
//   doctorImage: string;
// }

interface Doctor {
  id: string;
  name?: string;
  specialization?: string;
  qualification?: string;
  consultation_fee?: number;
  status?: string;
  avatar_url?: string | null;
}

interface AppointmentsContainerProps {
  initialAppointments?: Appointment[];
  doctorsList?: Doctor[];
  showNewButton?: boolean;
  newAppointmentUrl?: string;
}

export default function AppointmentsContainer({
  initialAppointments = [],
  doctorsList = [],
  showNewButton = true,
  newAppointmentUrl = "/admin/appointments/new",
}: AppointmentsContainerProps) {
  return (
    <DataContainer
      initialData={initialAppointments}
      HeaderComponent={AppointmentHeader}
      headerProps={{
        showNewButton,
        newAppointmentUrl,
      }}
      ListComponent={AppointmentsList}
      listComponentProps={{
        doctorsList,
      }}
      filterSortLogic={appointmentFilterLogic}
      onEditAction={updateAppointmentAction}
      onDeleteAction={deleteAppointmentAction}
      listPropName="appointments"
    />
  );
}