"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getAppointments, 
  updateAppointmentAction, 
  deleteAppointmentAction 
} from "../../../../../features/appointments/appointmentActions/appointmentAction"; 

import DataContainer, { appointmentFilterLogic } from "./../../../../../components/ui/appointmentData"; 
import AppointmentHeader from "../../../../../features/appointments/components/appointmentHeader"; 
import PendingAppointmentsList from "../../../../../features/appointments/components/appointmentRequests"; 

export default function PendingAppointmentsPage({ initialAppointments = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [loading, setLoading] = useState(!initialAppointments || initialAppointments.length === 0);

  useEffect(() => {
    let isMounted = true;

    async function fetchAppointments() {
      try {
        const data = await getAppointments({ status: "pending" });
        if (isMounted) {
          setAppointments(data || []);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (!initialAppointments || initialAppointments.length === 0) {
      fetchAppointments();
    } else {
      setAppointments(initialAppointments);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingOnlyFilterLogic = useCallback((data, searchTerm, activeFilters, sortOrder) => {
    return appointmentFilterLogic(data, searchTerm, { ...activeFilters, status: "pending" }, sortOrder);
  }, []);

  const handleConfirmAppointment = async (id, updatedData) => {
    const res = await updateAppointmentAction(id, { ...updatedData, status: "confirmed" });
    return res;
  };

  const handleDeleteAppointment = async (id) => {
    const res = await deleteAppointmentAction(id);
    return res;
  };

  // Wrapper to pass custom title "Appointment Requests" to AppointmentHeader
  const CustomHeaderWrapper = useCallback((props) => (
    <AppointmentHeader title="Appointment Requests" {...props} />
  ), []);

  // Memoized List Wrapper
  const CustomListWrapper = useCallback((props) => (
    <PendingAppointmentsList 
      appointments={props.data} 
      onConfirm={async (id) => {
        const itemToUpdate = props.data.find(app => app.id === id);
        if (itemToUpdate) {
          await props.onEdit({ ...itemToUpdate, status: "confirmed" });
        }
      }} 
      onDelete={props.onDelete} 
    />
  ), []);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500 font-medium mt-10">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] p-4 md:p-6">
      <DataContainer
        initialData={appointments}
        HeaderComponent={CustomHeaderWrapper}
        ListComponent={CustomListWrapper}
        filterSortLogic={pendingOnlyFilterLogic}
        onEditAction={handleConfirmAppointment}
        onDeleteAction={handleDeleteAppointment}
        listPropName="data" 
      />
    </div>
  );
}