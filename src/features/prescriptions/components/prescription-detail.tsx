import { StaticImageData } from "next/image";
import { Images } from "@/assets";
import Image from "next/image";
interface Prescription {
  id: string;
  clinicName: string;
  doctorName: string;
  //   doctorImage: StaticImageData;
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

interface Medicine {
  sno: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timings: string;
}

interface PrescriptionDetailProps {
  prescription: Prescription;
}

export default function PrescriptionDetail({
  prescription,
}: PrescriptionDetailProps) {
  return (
    <>
      <div className="bg-white p-5 box-border">
        <div className="flex items-center justify-between border-b pb-3 mb-3">
          <Image src={Images.Logo} alt="" />
          <span className=" border py-1 px-2">{prescription.id}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <div>
            <h2 className="font-bold">{prescription.clinicName}</h2>
            <h3>{prescription.doctorName}</h3>
            <h3>{prescription.doctorEducation}</h3>
          </div>
          <div>
            <p>Department: {prescription.department}</p>
            <p>Prescribed On: {prescription.prescribedOn}</p>
            <p>Consultation: {prescription.consultation}</p>
          </div>
        </div>
        <div className="mb-3">
          <h6 className="mb-2 text-sm font-medium">PatientDetails</h6>
          <div className="px-3 py-2 rounded flex align-items-center justify-between bg-gray-200">
            <div className="m-0 font-semibold text-xl">
              {prescription.patientName}
            </div>
            <div className="flex items-center gap-3">
              <span className="mb-0 text-gray-900">
                {prescription.patientAge}/{prescription.patientGender}
              </span>
              <span className="mb-0 text-gray-900">
                Blood:{prescription.patientBlood}
              </span>
              <span className="mb-0 text-gray-900">
                Patient ID:{prescription.id}
              </span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h6 className="mb-3 text-xl font-semibold text-center">
            Cardiology Prescription
          </h6>
        </div>
      </div>
    </>
  );
}
