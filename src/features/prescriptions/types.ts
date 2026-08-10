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
import { StaticImageData } from "next/image";

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

export interface Patient {
  image: string | StaticImageData | null;
  full_name: string;
  id: string;
  date_of_birth: string;
  gender: string;
  blood_group: string | null;
}

// Used In prescription-detail.tsx 
export interface PrescriptionDetailProps {
  data: {
    prescription: {
      id: string;
      diagnosis: string;
      blood_pressure: string | null;
      temperature: number | null;
      pulse_rate: number | null;
      weight: number | null;
      height: number | null;
      spo2: number | null;
      advice: string | null;
      created_at: string;
    };

    patient: {
      id: string;
      date_of_birth: string;
      blood_group: string | null;
    };

    profile: {
      full_name: string;
      gender: string;
      avatar_url: string | null;
    };

    medicines: {
      id: string;
      medicine_name: string;
      dosage: string;
      frequency: string;
      duration: string;
      timing: string;
      instructions: string | null;
    }[];
  };
}