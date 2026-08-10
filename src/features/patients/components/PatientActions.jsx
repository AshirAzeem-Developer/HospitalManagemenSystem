"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deletePatient } from "../actions";

export default function PatientActions({ id }) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    try {
      await deletePatient(id);

      setShowModal(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete patient");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {/* View */}
        <button
          className="rounded-md p-2 hover:bg-slate-100"
          title="View"
          onClick={() => router.push(`/admin/patients/${id}`)}
        >
          <Eye className="h-4 w-4 text-slate-600" />
        </button>

        {/* Edit */}
        <button
          className="rounded-md p-2 hover:bg-slate-100"
          title="Edit"
          onClick={() => router.push(`/admin/patients/${id}/edit`)}
        >
          <Pencil className="h-4 w-4 text-blue-600" />
        </button>

        {/* Delete */}
        <button
          className="rounded-md p-2 hover:bg-slate-100"
          title="Delete"
          onClick={() => setShowModal(true)}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Delete Patient
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete this patient? 
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}