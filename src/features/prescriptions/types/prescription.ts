import { StaticImageData } from "next/image";

export interface Medicine {
  sno: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timings: string;
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