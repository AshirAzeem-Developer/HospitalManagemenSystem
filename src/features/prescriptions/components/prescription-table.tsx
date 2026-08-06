"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";

import { FiFilter, FiMoreVertical, FiEye, FiTrash2 } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import { FaL } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import { PrescriptionListItem } from "../types/prescription";

interface PrescriptionTableProps {
  prescriptions: PrescriptionListItem[];
}

export default function PrescriptionTable({
  prescriptions,
}: PrescriptionTableProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(search.toLowerCase()) ||
      prescription.id.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">
        <h2 className="text-3xl font-bold text-slate-900">Prescriptions</h2>

        <div className="relative">
          <button
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
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border bg-white shadow-lg z-10">
              <button
                className="w-full px-4 py-3 text-left hover:bg-gray-100"
                onClick={() => {
                  console.log("Download PDF");
                  setShowExportMenu(false);
                }}
              >
                Download As PDF
              </button>

              <button
                className="w-full px-4 py-3 text-left hover:bg-gray-100"
                onClick={() => {
                  console.log("Download Excel");
                  setShowExportMenu(false);
                }}
              >
                Download as Excel
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
          <button className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
            <FiFilter />
            Filters
          </button>

          <button className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
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
                <td className="px-6 py-5 font-medium text-indigo-900">
                  #{prescription.id}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Image
                      src={prescription.patientImage}
                      alt={prescription.patientName}
                      width={42}
                      height={42}
                      className="rounded-full object-cover"
                    />

                    <span
                      onClick={() => {
                        router.push(`/doctor/prescriptions/${prescription.id}`);
                      }}
                      className=" cursor-pointer hover:text-teal-700 font-medium text-slate-800"
                    >
                      {prescription.patientName}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 text-gray-500">
                  {prescription.prescribedOn}
                </td>

                <td className="px-6 py-5 text-center">
                  {/* 3 dots wala kam hwa hw yhan edit and delete */}

                  <div className="relative">
                    <button
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
                        <button
                          className="flex w-full items-center gap-3 px-5 py-3 text-left text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            // console.log("View", prescription.id);

                            router.push(
                              `/doctor/prescriptions/${prescription.id}`,
                            );
                            setOpenMenu(null);
                          }}
                        >
                          <FiEye size={18} />
                          View
                        </button>

                        <button
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
      </div>
    </div>
  );
}
