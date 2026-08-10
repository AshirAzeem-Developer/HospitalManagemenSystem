"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FiFilter, FiMoreVertical, FiEye, FiTrash2 } from "react-icons/fi";

import { IoChevronDown } from "react-icons/io5";

interface PrescriptionListItem {
  id: string;
  patientName: string;
  patientImage: string | null;
  prescribedOn: string;
}

interface PrescriptionTableProps {
  prescriptions: PrescriptionListItem[];
}

export default function PrescriptionTable({
  prescriptions,
}: PrescriptionTableProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [search, setSearch] = useState("");

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const router = useRouter();

  // Search
  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(search.toLowerCase()) ||
      prescription.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="rounded-xl bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">
        <h2 className="text-xl font-semibold text-slate-800">Prescriptions</h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Export
            <IoChevronDown
              className={`transition-transform ${
                showExportMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg border bg-white shadow-lg">
              <button
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-gray-100"
                onClick={() => {
                  console.log("Download PDF");
                  setShowExportMenu(false);
                }}
              >
                Download As PDF
              </button>

              <button
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-gray-100"
                onClick={() => {
                  console.log("Download Excel");
                  setShowExportMenu(false);
                }}
              >
                Download As Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 md:w-72"
        />

        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            <FiFilter />
            Filters
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Sort By : Recent
            <IoChevronDown />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-y bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">
                Prescription ID
              </th>

              <th className="px-6 py-4 text-left font-semibold">Patient</th>

              <th className="px-6 py-4 text-left font-semibold">
                Prescribed On
              </th>

              <th className="w-20"></th>
            </tr>
          </thead>

          <tbody>
            {filteredPrescriptions.map((prescription) => (
              <tr
                key={prescription.id}
                className="border-b transition hover:bg-gray-50"
              >
                {/* Prescription ID */}
                <td className="px-6 py-5 font-medium text-indigo-900">
                  #{prescription.id}
                </td>

                {/* Patient */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {prescription.patientImage ? (
                      <img
                        src={prescription.patientImage}
                        alt={prescription.patientName}
                        width={42}
                        height={42}
                        className="h-[42px] w-[42px] rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-500">
                        ?
                      </div>
                    )}

                    <span
                      onClick={() =>
                        router.push(`/doctor/prescriptions/${prescription.id}`)
                      }
                      className="cursor-pointer font-medium text-slate-800 hover:text-teal-700"
                    >
                      {prescription.patientName}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-5 text-gray-500">
                  {prescription.prescribedOn}
                </td>

                {/* Menu */}
                <td className="px-6 py-5 text-center">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === prescription.id ? null : prescription.id,
                        )
                      }
                      className="rounded-lg border p-2 hover:bg-gray-100"
                    >
                      <FiMoreVertical size={18} />
                    </button>

                    {openMenu === prescription.id && (
                      <div className="absolute right-0 top-12 z-10 w-56 rounded-xl border bg-white py-2 shadow-lg">
                        {/* View */}
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 px-5 py-3 text-left text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            router.push(
                              `/doctor/prescriptions/${prescription.id}`,
                            );

                            setOpenMenu(null);
                          }}
                        >
                          <FiEye size={18} />
                          View
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 px-5 py-3 text-left text-red-600 hover:bg-red-50"
                          onClick={() => {
                            console.log("Delete", prescription.id);

                            setOpenMenu(null);
                          }}
                        >
                          <FiTrash2 size={18} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No search result */}
        {filteredPrescriptions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No prescriptions found.
          </div>
        )}
      </div>
    </div>
  );
}
