import { StaticImageData } from "next/image";

export interface Medicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  clinicName: string;
  doctorName: string;
  doctorEducation: string;
  doctorSignature: StaticImageData;

  department: string;
  prescribedOn: string;
  consultation: string;

  patientName: string;
  patientAge: number;
  patientGender: string;
  patientBlood: string;
  patientId: string;

  patientAdvice: string;
  patientFollowUp: string;

  medicines: Medicine[];
}

export interface PrescriptionListItem {
  id: string;
  patientName: string;
  patientImage: StaticImageData;
  prescribedOn: string;
}

export interface CreatePrescriptionInput {
  appointmentId: string;

  bloodPressure: string;
  temperature: number;
  pulseRate: number;
  weight: number;
  height: number;
  spo2: number;

  diagnosis: string;
  advice: string;

  medicines: Medicine[];
}
