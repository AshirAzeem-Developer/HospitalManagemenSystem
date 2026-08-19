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

function StableListWrapper(props) {
  const [processingIds, setProcessingIds] = useState([]);

  const runAction = async (id, status) => {
    const itemToUpdate = props.data.find((app) => app.id === id);
    if (!itemToUpdate) return;

    setProcessingIds((prev) => [...prev, id]);
    try {
      await props.onEdit({ ...itemToUpdate, status });
    } catch (error) {
      console.error("Error updating appointment:", error);
    } finally {
      setProcessingIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  return (
    <PendingAppointmentsList
      appointments={props.data}
      processingIds={processingIds}
      onConfirm={(id) => runAction(id, "confirmed")}
      onCancel={(id) => runAction(id, "cancelled")}
      onDelete={(id) => runAction(id, "cancelled")}
    />
  );
}

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
  // 🌟 FIX: Isko wapas [] kar diya hai taake loop/bar bar render na ho
  }, []); 

  const pendingOnlyFilterLogic = useCallback((data, searchTerm, activeFilters, sortOrder) => {
    return appointmentFilterLogic(data, searchTerm, { ...activeFilters, status: "pending" }, sortOrder);
  }, []);

  // 🌟 FIX: In dono functions ko useCallback mein wrap kar diya taake DataContainer bar bar render na ho
  const handleUpdateAppointment = useCallback(async (id, updatedData) => {
    await updateAppointmentAction(id, updatedData);
    return updatedData; 
  }, []);

  const handleDeleteAppointment = useCallback(async (id) => {
    await deleteAppointmentAction(id);
    return { id };
  }, []);

  const CustomHeaderWrapper = useCallback((props) => (
    <AppointmentHeader title="Appointment Requests" {...props} />
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
        ListComponent={StableListWrapper} 
        filterSortLogic={pendingOnlyFilterLogic}
        onEditAction={handleUpdateAppointment} 
        onDeleteAction={handleDeleteAppointment}
        listPropName="data" 
      />
    </div>
  );
}