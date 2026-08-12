"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";

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

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortLabels: Record<SortOption, string> = {
    recent: "Recent",
    oldest: "Oldest",
  };

  const visiblePrescriptions = useMemo(() => {
    let result = prescriptions.filter(
      (p) =>
        p.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        p.diagnosis.toLowerCase().includes(search.toLowerCase()),
    );

    result = [...result].sort((a, b) => {
      const aTime = new Date(a.prescribedOnRaw).getTime();
      const bTime = new Date(b.prescribedOnRaw).getTime();
      return sortOption === "recent" ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [prescriptions, search, sortOption]);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-slate-800">
          My Prescriptions
        </h2>
      </div>

      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by doctor or diagnosis"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 md:w-72"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSortMenu((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            Sort By : {sortLabels[sortOption]}
            <IoChevronDown
              size={16}
              className={`transition-transform ${
                showSortMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showSortMenu && (
            <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black/5">
              {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-gray-50 ${
                    sortOption === option
                      ? "font-medium text-indigo-600"
                      : "text-slate-700"
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
        <table className="w-full">
          <thead className="border-y border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Prescription ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Doctor
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Diagnosis
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Date
              </th>
              <th className="w-20"></th>
            </tr>
          </thead>

          <tbody>
            {visiblePrescriptions.map((prescription) => (
              <tr
                key={prescription.id}
                className="border-b border-gray-100 transition hover:bg-gray-50/60"
              >
                <td className="px-6 py-5 text-sm font-medium text-indigo-900">
                  #{prescription.id}
                </td>
                <td className="px-6 py-5 text-sm font-medium text-slate-800">
                  {prescription.doctorName}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500">
                  {prescription.diagnosis}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500">
                  {prescription.prescribedOn}
                </td>
                <td className="px-6 py-5 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/patient/prescriptions/${prescription.id}`)
                    }
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
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
          <div className="p-8 text-center text-sm text-gray-500">
            No prescriptions found.
          </div>
        )}
      </div>
    </div>
  );
}