import type { PatientRow } from "./types";
import PatientActions from "./components/PatientActions";

export const columns = [
  {
    key: "patient",
    label: "Patient",

    render: (row: PatientRow) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-gray-800 dark:text-gray-300">
          {row.profile?.avatar_url ? (
            <img
              src={row.profile.avatar_url}
              alt={row.profile?.full_name || "Patient"}
              className="h-full w-full object-cover"
            />
          ) : (
            row.profile?.full_name?.charAt(0).toUpperCase() || "P"
          )}
        </div>

        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {row.profile?.full_name || "-"}
          </p>

          <p className="text-xs text-slate-500 dark:text-gray-400">
            {row.profile?.gender || "-"}
          </p>
        </div>
      </div>
    ),
  },

  {
    key: "phone",
    label: "Phone",

    render: (row: PatientRow) => (
      <span className="text-slate-700 dark:text-gray-300">
        {row.phone || "—"}
      </span>
    ),
  },

  {
    key: "blood_group",
    label: "Blood Group",

    render: (row: PatientRow) => (
      <span className="text-slate-700 dark:text-gray-300">
        {row.blood_group || "-"}
      </span>
    ),
  },

  {
    key: "stay_address",
    label: "Address",

    render: (row: PatientRow) => (
      <span className="text-slate-700 dark:text-gray-300">
        {row.stay_address || "-"}
      </span>
    ),
  },

 {
  key: "doctor",
  label: "Doctor",

  render: (row: PatientRow) => (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-gray-800">
        {row.doctor?.profile?.avatar_url ? (
          <img
            src={row.doctor.profile.avatar_url}
            alt={row.doctor.profile.full_name || "Doctor"}
            className="h-full w-full object-cover"
          />
        ) : (
          row.doctor?.profile?.full_name?.charAt(0).toUpperCase() || "D"
        )}
      </div>

      <div>
        <p className="font-medium text-slate-900 dark:text-white">
          {row.doctor?.profile?.full_name || "-"}
        </p>

        <p className="text-xs text-slate-500 dark:text-gray-400">
          {row.doctor?.specialization || "-"}
        </p>

        <span
          className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            row.doctor?.status === "active"
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {row.doctor?.status ?? "-"}
        </span>
      </div>
    </div>
  ),
},



  {
    key: "actions",
    label: "Actions",

    render: (row: PatientRow) => (
      <PatientActions id={row.id} />
    ),
  },
];