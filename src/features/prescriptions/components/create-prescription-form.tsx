"use client";

import { StaticImageData } from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PatientInformation from "./patient-information";
import VitalsForm from "./vitals-form";
import DiagnosisForm from "./diagnosis-form";
import MedicinesTable from "./medicines-table";
import AdviceForm from "./advice-form";

import Button from "@/components/ui/button";

import { CreatePrescriptionInput, CreatePrescriptionSchema } from "../schema";

import { createPrescription } from "../actions";
import { Patient } from "../types";

interface CreatePrescriptionFormProps {
  patient: Patient
}

export default function CreatePrescriptionForm({
  patient,
}: CreatePrescriptionFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Temporary fallback for testing
  const appointmentId =
    searchParams.get("appointmentId") ?? "44444444-4444-4444-4444-444444444405";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePrescriptionInput>({
    resolver: zodResolver(CreatePrescriptionSchema),

    defaultValues: {
      appointmentId,

      diagnosis: "",

      bloodPressure: "",

      temperature: undefined,

      pulseRate: undefined,

      weight: undefined,

      height: undefined,

      spo2: undefined,

      advice: "",

      medicines: [],
    },
  });

  async function onSubmit(values: CreatePrescriptionInput) {
    console.log("Form Values:", values);

    const result = await createPrescription(values);

    console.log("Server Action Result:", result);

    if (!result.success) {
      alert(result.message ?? "Something went wrong");
      console.log(result);
      return;
    }

    alert("Prescription Created Successfully");

    router.push("/doctor/prescriptions");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PatientInformation patient={patient} />

      <VitalsForm register={register} errors={errors} />

      <DiagnosisForm register={register} />

      <MedicinesTable control={control} register={register} />

      <AdviceForm register={register} />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" text="Cancel" />

        <Button
          type="submit"
          variant="primary"
          text={isSubmitting ? "Saving..." : "Save Prescription"}
        />
      </div>
    </form>
  );
}
