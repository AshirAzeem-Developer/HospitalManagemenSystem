import {
  FileText,
  Eye,
  Download,
} from "lucide-react";

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
  return (
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

              <div className="flex shrink-0 items-center gap-2 text-slate-400">
                <button
                  type="button"
                  className="hover:text-slate-600"
                  title="View prescription"
                >
                  <Eye size={16} />
                </button>

                <button
                  type="button"
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
  );
}