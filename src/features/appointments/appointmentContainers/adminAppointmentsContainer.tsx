"use client";

import DataContainer, {
  appointmentFilterLogic,
  type Appointment,
} from "../../../components/ui/appointmentData";

import AppointmentHeader from "../components/appointmentHeader";
import AppointmentsList from "../components/appointmentList";

import {
  updateAppointmentAction,
  deleteAppointmentAction,
} from "../appointmentActions/appointmentAction";

type Doctor = {
  id: string;
  name: string;
  image?: string | null;
};

type AppointmentsContainerProps = {
  initialAppointments?: Appointment[];
  doctorsList?: Doctor[];
  showNewButton?: boolean;
  newAppointmentUrl?: string;
};

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