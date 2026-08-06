import { Images } from "@/assets";
import { Prescription } from "../types/prescription";


export const prescriptionDetail: Prescription[] = [
  {
    id: "PRE0025",
    clinicName: "Trustcare Clinic",
    doctorName: "Dr. Mick Thompson",
    doctorEducation: "MD Cardiologist. MBBS,MS",
    // doctorImage: "",
    doctorSignature: Images.Signature1,
    department: "Cardiology OP",
    prescribedOn: "19 Jan 2025",
    consultation: "Cardiology OP",

    patientName: "M.Reyan Verol",
    patientAge: 28,
    patientGender: "Male",
    patientBlood: "O+ve",
    patientId: "PT0025",

    patientAdvice: "Take medicines after meal and avoid oily food.",
    patientFollowUp: "Visit after 3 months with blood pressure report.",

    medicines: [
      {
        sno: 1,
        medicineName: "Aalu",
        dosage: "",
        frequency: "",
        duration: "",
        timings: "",
      },
      {
        sno: 2,
        medicineName: "Bhindhi",
        dosage: "",
        frequency: "",
        duration: "",
        timings: "",
      },
    ],
  },
  {
    id: "PRE0024",
    clinicName: "Clinic",
    doctorName: "Dr. Mick Thompson",
    doctorEducation: "MD Cardiologist. MBBS,MS",
    // doctorImage: "",
    doctorSignature: Images.Signature1,
    department: "Cardiology OP",
    prescribedOn: "19 Jan 2025",
    consultation: "Cardiology OP",

    patientName: "M.Reyan Verol",
    patientAge: 28,
    patientGender: "Male",
    patientBlood: "O+ve",
    patientId: "PT0025",

    patientAdvice: "Take medicines after meal and avoid oily food.",
    patientFollowUp: "Visit after 3 months with blood pressure report.",

    medicines: [
      {
        sno: 1,
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        timings: "",
      },
      {
        sno: 2,
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        timings: "",
      },
    ],
  },
];
