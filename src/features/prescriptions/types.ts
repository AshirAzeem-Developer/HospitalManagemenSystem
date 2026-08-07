// export interface PrescriptionFormData {
//   appointmentId: string;
//   patientId: string;
//   doctorId: string;

//   diagnosis: string;

//   bloodPressure: string;
//   temperature: number | null;
//   pulseRate: number | null;
//   weight: number | null;
//   height: number | null;
//   spo2: number | null;

//   advice: string;

//   medicines: MedicineFormData[];
// }

// export interface MedicineFormData {
//   medicineName: string;
//   dosage: string;
//   frequency: string;
//   duration: string;
//   timing: "before_meal" | "after_meal" | "anytime";
//   instructions: string;
// }

export interface PrescriptionItemForm {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: "before_meal" | "after_meal" | "anytime";
  instructions?: string;
}

export interface CreatePrescriptionForm {
  appointmentId: string;

  diagnosis: string;

  bloodPressure?: string;
  temperature?: number;
  pulseRate?: number;
  weight?: number;
  height?: number;
  spo2?: number;

  advice?: string;

  medicines: PrescriptionItemForm[];
}