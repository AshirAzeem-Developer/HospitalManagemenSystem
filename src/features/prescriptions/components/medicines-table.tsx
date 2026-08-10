"use client";

import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";

interface MedicinesTableProps {
  register: any;
  control: any;
}

interface MedicineForm {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  instructions: string;
}

export default function MedicinesTable({
  register,
  control,
}: MedicinesTableProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sidebar ke andar temporary medicine
  const [medicine, setMedicine] = useState<MedicineForm>({
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    timing: "after_meal",
    instructions: "",
  });

  function handleAddMedicine() {
    // Check
    if (
      !medicine.medicineName ||
      !medicine.dosage ||
      !medicine.frequency ||
      !medicine.duration ||
      !medicine.timing
    ) {
      alert("Please fill all required medicine fields");
      return;
    }

    // Actual React Hook Form medicines array mein add karo
    append(medicine);

    // Sidebar close
    setIsSidebarOpen(false);

    // Sidebar ko next medicine ke liye empty karo
    setMedicine({
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      timing: "after_meal",
      instructions: "",
    });
  }

  return (
    <>
      {/* ================= MEDICINES SECTION ================= */}

      <div className="rounded-xl border bg-white p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Medicines</h2>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <FiPlus />
            Add Medicine
          </button>
        </div>

        {/* ================= EMPTY STATE ================= */}

        {fields.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
            No medicine added yet.
          </div>
        ) : (
          /* ================= TABLE ================= */

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Dosage</th>
                  <th className="px-4 py-3">Frequency</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Timing</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className="border-b">
                    <td className="px-4 py-3">{field.medicineName}</td>

                    <td className="px-4 py-3">{field.dosage}</td>

                    <td className="px-4 py-3">{field.frequency}</td>

                    <td className="px-4 py-3">{field.duration}</td>

                    <td className="px-4 py-3">{field.timing}</td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= SIDEBAR ================= */}

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold">Add Medicine</h2>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* ================= FORM ================= */}

            <div className="space-y-5">
              {/* Medicine Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Medicine Name
                </label>

                <input
                  value={medicine.medicineName}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      medicineName: e.target.value,
                    })
                  }
                  placeholder="Enter medicine name"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:border-teal-500"
                />
              </div>

              {/* Dosage */}
              <div>
                <label className="mb-2 block text-sm font-medium">Dosage</label>

                <input
                  value={medicine.dosage}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      dosage: e.target.value,
                    })
                  }
                  placeholder="500mg"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:border-teal-500"
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Frequency
                </label>

                <input
                  value={medicine.frequency}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      frequency: e.target.value,
                    })
                  }
                  placeholder="1-0-1"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:border-teal-500"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Duration
                </label>

                <input
                  value={medicine.duration}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      duration: e.target.value,
                    })
                  }
                  placeholder="7 Days"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:border-teal-500"
                />
              </div>

              {/* Timing */}
              <div>
                <label className="mb-2 block text-sm font-medium">Timing</label>

                <select
                  value={medicine.timing}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      timing: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border px-4 py-2"
                >
                  <option value="before_meal">Before Meal</option>

                  <option value="after_meal">After Meal</option>

                  <option value="anytime">Anytime</option>
                </select>
              </div>

              {/* Instructions */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Instructions
                </label>

                <textarea
                  value={medicine.instructions}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      instructions: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Drink plenty of water"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* ================= FOOTER ================= */}

            <div className="mt-8 flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddMedicine}
                className="rounded-lg bg-teal-600 px-5 py-2 text-white hover:bg-teal-700"
              >
                Add Medicine
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
