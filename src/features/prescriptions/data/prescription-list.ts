import { Images } from "@/assets";
import { PrescriptionListItem } from "../types/prescription";

export const prescriptionList: PrescriptionListItem[] = [
  {
    id: "PRE0025",
    patientName: "John Richard",
    patientImage: Images.User1,
    prescribedOn: "19 Jan 2025",
  },
  {
    id: "PRE0024",
    patientName: "Susan Babin",
    patientImage: Images.User2,
    prescribedOn: "12 Mar 2025",
  },
  {
    id: "PRE0023",
    patientName: "Marsha Noland",
    patientImage: Images.User3,
    prescribedOn: "27 Mar 2025",
  },
];