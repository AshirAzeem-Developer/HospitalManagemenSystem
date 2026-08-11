
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deletePatient } from "../actions";

type PatientActionsProps = {
  id: string;
};

export default function PatientActions({
  id,
}: PatientActionsProps) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleDelete() {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await deletePatient(id);

      if (!result.success) {
        setErrorMessage(
          result.error ||
            "This patient cannot be deleted."
        );
        return;
      }

      setShowModal(false);
      router.refresh();
    } catch {
      setErrorMessage(
        "Unable to delete this patient. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCloseModal() {
    if (!loading) {
      setShowModal(false);
      setErrorMessage("");
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {/* View */}
        <button
          type="button"
          className="rounded-md p-2 hover:bg-slate-100"
          title="View"
          onClick={() =>
            router.push(`/admin/patients/${id}`)
          }
        >
          <Eye className="h-4 w-4 text-slate-600" />
        </button>

        {/* Edit */}
        <button
          type="button"
          className="rounded-md p-2 hover:bg-slate-100"
          title="Edit"
          onClick={() =>
            router.push(`/admin/patients/${id}/edit`)
          }
        >
          <Pencil className="h-4 w-4 text-blue-600" />
        </button>

        {/* Delete */}
        <button
          type="button"
          className="rounded-md p-2 hover:bg-slate-100"
          title="Delete"
          onClick={() => {
            setErrorMessage("");
            setShowModal(true);
          }}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Delete Patient
            </h2>

            {errorMessage ? (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm leading-5 text-red-700">
                  {errorMessage}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm leading-5 text-slate-500">
                Are you sure you want to delete this
                patient?
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              {!errorMessage && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 sm:w-auto"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

