"use client";

import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useFieldArray } from "react-hook-form";

interface MedicinesTableProps {
  register: any;
  control: any;
}

export default function MedicinesTable({
  register,
  control,
}: MedicinesTableProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Medicines</h2>

        <button
          type="button"
          onClick={() =>
            append({
              medicineName: "",
              dosage: "",
              frequency: "",
              duration: "",
              timing: "",
              instructions: "",
            })
          }
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <FiPlus />
          Add Medicine
        </button>
      </div>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          No medicine added yet.
        </div>
      )}

      {/* Medicines */}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border p-5">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">
                Medicine {index + 1}
              </h3>

              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
              >
                <FiTrash2 size={18} />
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Medicine Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Medicine Name
                </label>

                <input
                  {...register(`medicines.${index}.medicineName`)}
                  placeholder="Enter medicine name"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:border-teal-500"
                />
              </div>

              {/* Dosage */}
              <div>
                <label className="mb-2 block text-sm font-medium">Dosage</label>

                <input
                  {...register(`medicines.${index}.dosage`)}
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
                  {...register(`medicines.${index}.frequency`)}
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
                  {...register(`medicines.${index}.duration`)}
                  placeholder="7 Days"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:border-teal-500"
                />
              </div>

              {/* Timing */}
              <div>
                <label className="mb-2 block text-sm font-medium">Timing</label>

                <select
                  {...register(`medicines.${index}.timing`)}
                  className="w-full rounded-lg border px-4 py-2"
                >
                  <option value="">Select</option>

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

                <input
                  {...register(`medicines.${index}.instructions`)}
                  placeholder="Drink plenty of water"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
