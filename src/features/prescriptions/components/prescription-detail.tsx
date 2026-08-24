import { PrescriptionDetailProps } from "../types";
import PatientInformation from "./patient-information";
import DownloadPrescriptionButton from "./download-prescription-button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrescriptionDetail({
  data,
  backHref,
}: PrescriptionDetailProps & { backHref: string }) {
  const { prescription, patient, profile, medicines } = data;

  return (
    <div className="mx-auto min-w-0 max-w-[1280px]">
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] print:hidden"
      >
        <ArrowLeft size={17} />
        Back to prescriptions
      </Link>

      <section className="prescription-print-root min-w-0 space-y-4 sm:space-y-6 print:max-w-none print:space-y-5 print:text-black">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 14mm 12mm; }
          .prescription-print-root {
            color: #111827 !important;
            font-size: 11pt;
          }
          .prescription-print-root h1 {
            font-size: 19pt !important;
            line-height: 1.2;
          }
          .prescription-print-root h2 {
            margin-bottom: 10px !important;
            font-size: 13pt !important;
            line-height: 1.25;
          }
          .prescription-print-root > div {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 0 !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
          }
          .prescription-print-root > div:not(:first-of-type) {
            border-top: 1px solid #d1d5db !important;
            padding-top: 14px !important;
          }
          .prescription-print-root table {
            width: 100% !important;
            font-size: 8.5pt !important;
          }
          .prescription-print-root th,
          .prescription-print-root td {
            padding: 6px 5px !important;
            vertical-align: top;
            overflow-wrap: anywhere;
          }
          .prescription-print-root .print-muted {
            color: #4b5563 !important;
          }
        }
      `}</style>
      {/* Prescription Information */}
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-7 print:border-b print:border-gray-300 print:p-0 print:pb-4 print:shadow-none">
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)] sm:text-2xl print:text-black">
            Prescription #{prescription.id}
          </h1>

          <p className="print-muted mt-2 text-sm text-[var(--muted)] print:text-gray-600">
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
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7 print:border-none print:p-0 print:pt-0">
        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
          Diagnosis
        </h2>

        <p className="text-[var(--foreground)] print:text-black">{prescription.diagnosis}</p>
      </div>

      {/* Vitals */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7 print:border-none print:p-0">
        <h2 className="mb-5 text-lg font-semibold text-[var(--foreground)]">
          Vitals
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-6 print:grid-cols-6 print:gap-4">
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
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7 print:border-none print:p-0">
        <h2 className="mb-5 text-lg font-semibold text-[var(--foreground)]">
          Medicines
        </h2>

        {medicines.length === 0 ? (
          <p className="text-[var(--muted)]">No medicines prescribed.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm text-[var(--foreground)] sm:text-base print:min-w-0 print:table-fixed print:text-[9px]">
              <thead className="border-y border-[var(--border)] bg-[var(--hover)] print:border-gray-300 print:bg-transparent">
                <tr>
                  <th className="w-[6%] px-2 py-2 text-left text-[var(--foreground)] print:text-black">S.No</th>
                  <th className="w-[18%] px-2 py-2 text-left text-[var(--foreground)] print:text-black">Medicine</th>
                  <th className="w-[12%] px-2 py-2 text-left text-[var(--foreground)] print:text-black">Dosage</th>
                  <th className="w-[14%] px-2 py-2 text-left text-[var(--foreground)] print:text-black">Frequency</th>
                  <th className="w-[12%] px-2 py-2 text-left text-[var(--foreground)] print:text-black">Duration</th>
                  <th className="w-[12%] px-2 py-2 text-left text-[var(--foreground)] print:text-black">Timing</th>
                  <th className="w-[26%] px-2 py-2 text-left text-[var(--foreground)] print:text-black">Instructions</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((medicine, index) => (
                  <tr key={medicine.id} className="border-b border-[var(--border)] print:border-gray-300">
                    <td className="break-words px-2 py-2 print:text-black">{index + 1}</td>

                    <td className="break-words px-2 py-2 font-medium text-[var(--foreground)] print:text-black">
                      {medicine.medicine_name}
                    </td>

                    <td className="break-words px-2 py-2 print:text-black">{medicine.dosage}</td>

                    <td className="break-words px-2 py-2 print:text-black">{medicine.frequency}</td>

                    <td className="break-words px-2 py-2 print:text-black">{medicine.duration}</td>

                    <td className="break-words px-2 py-2 print:text-black">{medicine.timing}</td>
                    <td className="break-words px-2 py-2 print:text-black">{medicine.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Advice */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7 print:border-none print:p-0">
        <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">
          Advice
        </h2>

        <p className="print-muted text-[var(--muted)] print:text-gray-700">
          {prescription.advice || "No advice provided."}
        </p>
      </div>
      </section>
    </div>
  );
}
