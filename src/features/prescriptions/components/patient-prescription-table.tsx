"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import PaginationSearchBar from "@/components/ui/PaginationSearchBar";

interface PatientPrescriptionListItem {
  id: string;
  doctorName: string;
  diagnosis: string;
  prescribedOn: string;
  prescribedOnRaw: string;
}

interface PatientPrescriptionTableProps {
  prescriptions: PatientPrescriptionListItem[];
}

type SortOption = "recent" | "oldest";

export default function PatientPrescriptionTable({
  prescriptions,
}: PatientPrescriptionTableProps) {
  const router = useRouter();

  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortLabels: Record<SortOption, string> = {
    recent: "Recent",
    oldest: "Oldest",
  };

  const visiblePrescriptions = useMemo(() => {
    let result = [...prescriptions];

    result = [...result].sort((a, b) => {
      const aTime = new Date(a.prescribedOnRaw).getTime();
      const bTime = new Date(b.prescribedOnRaw).getTime();
      return sortOption === "recent" ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [prescriptions, sortOption]);

  return (
    <div className="min-w-0 rounded-xl border border-border bg-background shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">My Prescriptions</h2>
      </div>

      <div className="flex flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <PaginationSearchBar placeholder="Search prescriptions" />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSortMenu((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            Sort By : {sortLabels[sortOption]}
            <IoChevronDown
              size={16}
              className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`}
            />
          </button>

          {showSortMenu && (
            <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-background py-1 shadow-lg ring-1 ring-black/5">
              {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-hover ${
                    sortOption === option ? "font-medium text-indigo-600" : "text-foreground"
                  }`}
                  onClick={() => {
                    setSortOption(option);
                    setShowSortMenu(false);
                  }}
                >
                  {sortLabels[option]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="border-y border-border bg-hover">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted">Prescription ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted">Doctor</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted">Diagnosis</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted">Date</th>
              <th className="w-20"></th>
            </tr>
          </thead>

          <tbody>
            {visiblePrescriptions.map((prescription) => (
              <tr key={prescription.id} className="border-b border-border transition hover:bg-hover/60">
                <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-foreground">#{prescription.id}</td>
                <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-foreground">{prescription.doctorName}</td>
                <td className="px-6 py-5 text-sm text-muted">{prescription.diagnosis}</td>
                <td className="whitespace-nowrap px-6 py-5 text-sm text-muted">{prescription.prescribedOn}</td>
                <td className="px-6 py-5 text-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/patient/prescriptions/${prescription.id}`)}
                    className="rounded-lg border border-border bg-background p-2 text-foreground transition hover:bg-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    aria-label="View prescription"
                  >
                    <FiEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visiblePrescriptions.length === 0 && (
          <div className="p-8 text-center text-sm text-muted">No prescriptions found.</div>
        )}
      </div>
    </div>
  );
}