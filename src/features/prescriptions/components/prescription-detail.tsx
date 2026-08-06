import { StaticImageData } from "next/image";
import { Images } from "@/assets";
import Image from "next/image";

import { Prescription } from "../types/prescription";

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
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    S.No
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Medicine Name
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Dosage
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Frequency
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Duration
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Timings
                  </th>
                </tr>
              </thead>

              <tbody>
                {prescription.medicines.map((medicine) => (
                  <tr key={medicine.sno} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{medicine.sno}</td>
                    <td className="px-4 py-3">{medicine.medicineName}</td>
                    <td className="px-4 py-3">{medicine.dosage}</td>
                    <td className="px-4 py-3">{medicine.frequency}</td>
                    <td className="px-4 py-3">{medicine.duration}</td>
                    <td className="px-4 py-3">{medicine.timings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8 border-b pb-5">
          <h3 className="mb-2 text-lg font-semibold">Advice</h3>

          <p className="leading-7 text-gray-600">
            {prescription.patientAdvice}
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-6 border-b pb-6 md:flex-row md:items-end">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Follow Up</h3>

            <p className="text-gray-600">{prescription.patientFollowUp}</p>
          </div>

          <div className="text-center">
            <Image
              src={prescription.doctorSignature}
              alt="Doctor Signature"
              className="mx-auto mb-2"
            />

            <h4 className="font-semibold">{prescription.doctorName}</h4>

            <p className="text-sm text-gray-500">
              {prescription.doctorEducation}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
