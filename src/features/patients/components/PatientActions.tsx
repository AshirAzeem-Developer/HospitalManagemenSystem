"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
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
          result.error || "This patient cannot be deleted."
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
      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* View */}
        <Button
          type="button"
          variant="ghost"
          text=""
          icon={<Eye className="h-4 w-4 text-slate-600" />}
          title="View"
          onClick={() =>
            router.push(`/admin/patients/${id}`)
          }
          className="h-8 w-8 border-0 p-0 hover:bg-slate-100"
        />

        {/* Edit */}
        <Button
  type="button"
  variant="ghost"
  text=""
  icon={<Pencil className="h-4 w-4 text-blue-600" />}
  title="Edit"
  onClick={() => {
    console.log("EDIT CLICKED", id);
    router.push(`/admin/patients/${id}/edit`);
  }}
  className="h-8 w-8 border-0 p-0 hover:bg-slate-100"
/>

        {/* Delete */}
        <Button
          type="button"
          variant="ghost"
          text=""
          icon={<Trash2 className="h-4 w-4 text-red-600" />}
          title="Delete"
          onClick={() => {
            setErrorMessage("");
            setShowModal(true);
          }}
          className="h-8 w-8 border-0 p-0 hover:bg-slate-100"
        />
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto overflow-x-hidden rounded-xl bg-white p-5 shadow-xl sm:p-6">
            <h2 className="w-full break-words text-lg font-semibold text-slate-900">
              Delete Patient
            </h2>

            {errorMessage ? (
              <div className="mt-3 w-full rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="w-full whitespace-normal break-words text-sm leading-5 text-red-700">
                  {errorMessage}
                </p>
              </div>
            ) : (
              <p className="mt-2 w-full whitespace-normal break-words text-sm leading-5 text-slate-500">
                Are you sure you want to delete this patient?
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              {/* Cancel */}
              <Button
                type="button"
                variant="ghost"
                text="Cancel"
                onClick={handleCloseModal}
                disabled={loading}
                className="w-full sm:w-auto"
              />

              {/* Delete */}
              {!errorMessage && (
                <Button
                  type="button"
                  variant="danger"
                  text={loading ? "Deleting..." : "Delete"}
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full sm:w-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}