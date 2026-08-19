import Image from "next/image";
import { PrescriptionDetailProps } from "../types";
import PatientInformation from "./patient-information";
import DownloadPrescriptionButton from "./download-prescription-button";

export default function PrescriptionDetail({ data }: PrescriptionDetailProps) {
  const { prescription, patient, profile, medicines } = data;

  return (
    <section className="space-y-6 print:space-y-4">
      {/* Prescription Information */}
      <div className="flex items-start justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm print:border-none print:p-0">
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">
            Prescription #{prescription.id}
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
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
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm print:border-none print:p-0">
        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
          Diagnosis
        </h2>

        <p className="text-[var(--foreground)]">{prescription.diagnosis}</p>
      </div>

      {/* Vitals */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm print:border-none print:p-0">
        <h2 className="mb-5 text-lg font-semibold text-[var(--foreground)]">
          Vitals
        </h2>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          <div>
            <p className="text-sm text-[var(--muted)]">Blood Pressure</p>
            <p className="font-semibold text-[var(--foreground)]">
              {prescription.blood_pressure ?? "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted)]">Temperature</p>
            <p className="font-semibold text-[var(--foreground)]">
              {prescription.temperature ?? "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted)]">Pulse Rate</p>
            <p className="font-semibold text-[var(--foreground)]">
              {prescription.pulse_rate ?? "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted)]">SpO2</p>
            <p className="font-semibold text-[var(--foreground)]">
              {prescription.spo2 ?? "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted)]">Weight</p>
            <p className="font-semibold text-[var(--foreground)]">
              {prescription.weight ?? "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted)]">Height</p>
            <p className="font-semibold text-[var(--foreground)]">
              {prescription.height ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm print:border-none print:p-0">
        <h2 className="mb-5 text-lg font-semibold text-[var(--foreground)]">
          Medicines
        </h2>

        {medicines.length === 0 ? (
          <p className="text-[var(--muted)]">No medicines prescribed.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[var(--foreground)]">
              <thead className="border-y border-[var(--border)] bg-[var(--hover)] print:bg-transparent">
                <tr>
                  <th className="px-4 py-3 text-left text-[var(--foreground)]">S.No</th>
                  <th className="px-4 py-3 text-left text-[var(--foreground)]">Medicine</th>
                  <th className="px-4 py-3 text-left text-[var(--foreground)]">Dosage</th>
                  <th className="px-4 py-3 text-left text-[var(--foreground)]">Frequency</th>
                  <th className="px-4 py-3 text-left text-[var(--foreground)]">Duration</th>
                  <th className="px-4 py-3 text-left text-[var(--foreground)]">Timing</th>
                  <th className="px-4 py-3 text-left text-[var(--foreground)]">Instructions</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((medicine, index) => (
                  <tr key={medicine.id} className="border-b border-[var(--border)]">
                    <td className="px-4 py-3">{index + 1}</td>

                    <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                      {medicine.medicine_name}
                    </td>

                    <td className="px-4 py-3">{medicine.dosage}</td>

                    <td className="px-4 py-3">{medicine.frequency}</td>

                    <td className="px-4 py-3">{medicine.duration}</td>

                    <td className="px-4 py-3">{medicine.timing}</td>
                    <td className="px-4 py-3">{medicine.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Advice */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm print:border-none print:p-0">
        <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">
          Advice
        </h2>

        <p className="text-[var(--muted)]">
          {prescription.advice || "No advice provided."}
        </p>
      </div>
    </section>
  );
}
