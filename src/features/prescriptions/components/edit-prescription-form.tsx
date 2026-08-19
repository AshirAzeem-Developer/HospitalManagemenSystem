"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PatientInformation from "./patient-information";
import VitalsForm from "./vitals-form";
import DiagnosisForm from "./diagnosis-form";
import MedicinesTable from "./medicines-table";
import AdviceForm from "./advice-form";

import Button from "@/components/ui/button";

import { CreatePrescriptionInput, CreatePrescriptionSchema } from "../schema";
import { updatePrescription } from "../actions";
import { PrescriptionDetailProps } from "../types";

type EditPrescriptionFormProps = {
  prescriptionId: string;
} & PrescriptionDetailProps;

export default function EditPrescriptionForm({
  prescriptionId,
  data,
}: EditPrescriptionFormProps) {
  const { prescription, patient, profile, medicines } = data;
  const router = useRouter();

  // We reuse CreatePrescriptionSchema/CreatePrescriptionInput here (rather
  // than UpdatePrescriptionSchema) purely so VitalsForm/DiagnosisForm/
  // MedicinesTable/AdviceForm — which are typed around
  // CreatePrescriptionInput — work unmodified. appointmentId is carried in
  // the form state just to satisfy that type; it's never rendered, never
  // edited, and is stripped out before calling updatePrescription. It comes
  // straight from the existing prescription record — there's no reason to
  // read it from the URL or fall back to a hardcoded id here.
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePrescriptionInput>({
    resolver: zodResolver(CreatePrescriptionSchema),

    defaultValues: {
      appointmentId: prescription.appointment_id,

      diagnosis: prescription.diagnosis ?? "",

      bloodPressure: prescription.blood_pressure ?? "",

      temperature: prescription.temperature ?? undefined,

      pulseRate: prescription.pulse_rate ?? undefined,

      weight: prescription.weight ?? undefined,

      height: prescription.height ?? undefined,

      spo2: prescription.spo2 ?? undefined,

      advice: prescription.advice ?? "",

      medicines: medicines.map((medicine) => ({
        medicineName: medicine.medicine_name,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        duration: medicine.duration,
        timing:
          medicine.timing as CreatePrescriptionInput["medicines"][number]["timing"],
        instructions: medicine.instructions ?? "",
      })),
    },
  });

  async function onSubmit(values: CreatePrescriptionInput) {
    const { appointmentId: _appointmentId, ...updateValues } = values;

    const result = await updatePrescription(prescriptionId, updateValues);

    if (!result.success) {
      alert(result.message ?? "Something went wrong");
      return;
    }

    alert("Prescription Updated Successfully");

    router.push(`/doctor/prescriptions/${prescriptionId}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PatientInformation
        patient={patient}
        profile={profile}
        prescriptionDate={prescription.created_at}
      />

      <VitalsForm register={register} errors={errors} />

      <DiagnosisForm register={register} />

      <MedicinesTable control={control} register={register} />

      <AdviceForm register={register} />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          text="Cancel"
          onClick={() => router.push(`/doctor/prescriptions`)}
        />

        <Button
          type="submit"
          variant="primary"
          text={isSubmitting ? "Saving..." : "Save Changes"}
        />
      </div>
    </form>
  );
}
