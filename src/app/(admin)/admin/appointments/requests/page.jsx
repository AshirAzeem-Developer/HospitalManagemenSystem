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

  // UPDATE: Yahan se hardcoded 'confirmed' hata diya hai taake cancel/confirm dono chal sakein
  const handleUpdateAppointment = async (id, updatedData) => {
    const res = await updateAppointmentAction(id, updatedData);
    return res;
  };

  const handleDeleteAppointment = async (id) => {
    const res = await deleteAppointmentAction(id);
    return res;
  };

  const CustomHeaderWrapper = useCallback((props) => (
    <AppointmentHeader title="Appointment Requests" {...props} />
  ), []);

  const CustomListWrapper = useCallback((props) => (
    <PendingAppointmentsList 
      appointments={props.data} 
      onConfirm={async (id) => {
        const itemToUpdate = props.data.find(app => app.id === id);
        if (itemToUpdate) {
          // Tick click hone par status: 'confirmed' bheje ga
          await props.onEdit({ ...itemToUpdate, status: "confirmed" });
        }
      }} 
      
      // Cross click hone par ab delete nahi hoga, balke status: 'cancelled' bheje ga
      onCancel={async (id) => {
        const itemToUpdate = props.data.find(app => app.id === id);
        if (itemToUpdate) {
          await props.onEdit({ ...itemToUpdate, status: "cancelled" });
        }
      }}
      // (Fallback) Agar child component purana `onDelete` use kar raha hai tab bhi cancel hi hoga
      onDelete={async (id) => {
        const itemToUpdate = props.data.find(app => app.id === id);
        if (itemToUpdate) {
          await props.onEdit({ ...itemToUpdate, status: "cancelled" });
        }
      }} 
    />
  ), []);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted font-medium mt-10">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <DataContainer
        initialData={appointments}
        HeaderComponent={CustomHeaderWrapper}
        ListComponent={CustomListWrapper}
        filterSortLogic={pendingOnlyFilterLogic}
        onEditAction={handleUpdateAppointment} 
        onDeleteAction={handleDeleteAppointment}
        listPropName="data" 
      />
    </div>
  );
}