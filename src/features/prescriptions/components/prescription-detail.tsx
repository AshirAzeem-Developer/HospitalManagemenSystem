import Image from "next/image";
import { PrescriptionDetailProps } from "../types";
import PatientInformation from "./patient-information";
import DownloadPrescriptionButton from "./download-prescription-button";

export default function PrescriptionDetail({ data }: PrescriptionDetailProps) {
  const { prescription, patient, profile, medicines } = data;

  return (
    <section className="space-y-6 print:space-y-4">
      {/* Prescription Information */}
      <div className="flex items-start justify-between rounded-xl border bg-white p-6 print:border-none print:p-0">
        <div>
          <h1 className="text-xl font-semibold">
            Prescription #{prescription.id}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Created on{" "}
            {new Date(prescription.created_at).toLocaleDateString("en-GB")}
          </p>
        </div>

        <DownloadPrescriptionButton />
      </div>

      {/* Patient Information */}
      <PatientInformation
        patient={patient}
        profile={profile}
        prescriptionDate={prescription.created_at}
      />

      {/* Diagnosis */}
      <div className="rounded-xl border bg-white p-6 print:border-none print:p-0">
        <h2 className="mb-4 text-lg font-semibold">Diagnosis</h2>

        <p>{prescription.diagnosis}</p>
      </div>

      {/* Vitals */}
      <div className="rounded-xl border bg-white p-6 print:border-none print:p-0">
        <h2 className="mb-5 text-lg font-semibold">Vitals</h2>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Blood Pressure</p>
            <p className="font-semibold">
              {prescription.blood_pressure ?? "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="font-semibold">{prescription.temperature ?? "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Pulse Rate</p>
            <p className="font-semibold">{prescription.pulse_rate ?? "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">SpO2</p>
            <p className="font-semibold">{prescription.spo2 ?? "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-semibold">{prescription.weight ?? "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Height</p>
            <p className="font-semibold">{prescription.height ?? "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="rounded-xl border bg-white p-6 print:border-none print:p-0">
        <h2 className="mb-5 text-lg font-semibold">Medicines</h2>

        {medicines.length === 0 ? (
          <p className="text-gray-500">No medicines prescribed.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-y bg-gray-50 print:bg-transparent">
                <tr>
                  <th className="px-4 py-3 text-left">S.No</th>
                  <th className="px-4 py-3 text-left">Medicine</th>
                  <th className="px-4 py-3 text-left">Dosage</th>
                  <th className="px-4 py-3 text-left">Frequency</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-left">Timing</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((medicine, index) => (
                  <tr key={medicine.id} className="border-b">
                    <td className="px-4 py-3">{index + 1}</td>

                    <td className="px-4 py-3 font-medium">
                      {medicine.medicine_name}
                    </td>

                    <td className="px-4 py-3">{medicine.dosage}</td>

                    <td className="px-4 py-3">{medicine.frequency}</td>

                    <td className="px-4 py-3">{medicine.duration}</td>

                    <td className="px-4 py-3">{medicine.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Advice */}
      <div className="rounded-xl border bg-white p-6 print:border-none print:p-0">
        <h2 className="mb-3 text-lg font-semibold">Advice</h2>

        <p className="text-gray-600">
          {prescription.advice || "No advice provided."}
        </p>
      </div>
    </section>
  );
}