"use client";

import {
  FileText,
  Eye,
  Download,
  X,
} from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/button"; 
type PrescriptionItem = {
  id: string;
  medicine_name: string;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  timing?: string | null;
  instructions?: string | null;
};

type Prescription = {
  id: string;
  appointment_id?: string | null;
  temperature?: string | number | null;
  pulse_rate?: string | number | null;
  weight?: string | number | null;
  height?: string | number | null;
  spo2?: string | number | null;
  advice?: string | null;
  created_at: string;
  prescription_items?: PrescriptionItem[];
};

type PrescriptionsCardProps = {
  prescriptions?: Prescription[];
};

export default function PrescriptionsCard({
  prescriptions = [],
}: PrescriptionsCardProps) {
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  const handleDownload = (prescription: Prescription) => {
    setSelectedPrescription(prescription);

    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <>
      {/* Prescriptions Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          Prescriptions
        </h2>

        <div className="space-y-4">
          {prescriptions.length === 0 && (
            <p className="text-sm text-slate-500">
              No prescriptions found.
            </p>
          )}

          {prescriptions.slice(0, 4).map((prescription) => {
            const firstMedicine =
              prescription.prescription_items?.[0];

            return (
              <div
                key={prescription.id}
                className="flex items-center justify-between gap-3"
              >
                {/* Prescription info */}
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <FileText size={16} />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {firstMedicine?.medicine_name ||
                        "Prescription"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {new Date(
                        prescription.created_at
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2 text-slate-400">
                  {/* View */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPrescription(prescription)
                    }
                    className="hover:text-slate-600"
                    title="View prescription"
                  >
                    <Eye size={16} />
                  </button>

                  {/* Download */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(prescription)
                    }
                    className="hover:text-slate-600"
                    title="Download prescription"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prescription Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            id="prescription-print"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() =>
                setSelectedPrescription(null)
              }
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 print:hidden"
              title="Close"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Prescription
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Date:{" "}
                {new Date(
                  selectedPrescription.created_at
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Vitals */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Patient Vitals
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Temperature
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedPrescription.temperature ?? "—"} F
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Heart Rate
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedPrescription.pulse_rate ?? "—"} Bpm
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Weight
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedPrescription.weight ?? "—"} kg
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Height
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedPrescription.height ?? "—"}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    SpO2
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedPrescription.spo2 ?? "—"} %
                  </p>
                </div>
              </div>
            </div>

            {/* Medicines */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Medicines
              </h3>

              {selectedPrescription.prescription_items &&
              selectedPrescription.prescription_items.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-3 text-left font-semibold text-slate-700">
                          Medicine
                        </th>
                        <th className="px-3 py-3 text-left font-semibold text-slate-700">
                          Dosage
                        </th>
                        <th className="px-3 py-3 text-left font-semibold text-slate-700">
                          Frequency
                        </th>
                        <th className="px-3 py-3 text-left font-semibold text-slate-700">
                          Duration
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedPrescription.prescription_items.map(
                        (item) => (
                          <tr
                            key={item.id}
                            className="border-t border-slate-200"
                          >
                            <td className="px-3 py-3 font-medium text-slate-900">
                              {item.medicine_name}
                            </td>

                            <td className="px-3 py-3 text-slate-600">
                              {item.dosage || "—"}
                            </td>

                            <td className="px-3 py-3 text-slate-600">
                              {item.frequency || "—"}
                            </td>

                            <td className="px-3 py-3 text-slate-600">
                              {item.duration || "—"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No medicines found.
                </p>
              )}
            </div>

            {/* Advice */}
            {selectedPrescription.advice && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                 Doctor&apos;s Advice 
                </h3>

                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                  {selectedPrescription.advice}
                </div>
              </div>
            )}

            {/* Print button */}
            <div className="flex justify-end print:hidden">
              <Button
                variant="apply"
                text="Download / Print"
                icon={<Download size={16} />}
                onClick={() => window.print()}
              />
            </div>
          </div>
        </div>
      )}

      {/* Print styling */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #prescription-print,
          #prescription-print * {
            visibility: visible;
          }

          #prescription-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            max-height: none;
            overflow: visible;
            box-shadow: none;
            border-radius: 0;
          }
        }
      `}</style>
    </>
  );
}