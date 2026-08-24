import type { PatientRow } from "./types";
import PatientActions from "./components/PatientActions";
import { Badge } from "@/components/ui/badge";

function getDoctorStatusColor(
  status?: string
): "green" | "yellow" | "blue" | "red" {
  switch (status?.toLowerCase()) {
    case "available":
      return "green";

    case "on leave":
    case "on_leave":
      return "yellow";

    default:
      return "blue";
  }
}

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

          <div className="mt-1">
            <Badge
              color={getDoctorStatusColor(row.doctor?.status)}
              type="light"
            >
              {row.doctor?.status || "-"}
            </Badge>
          </div>
        </div>
      </div>
    ),
  },

  {
    key: "actions",
    label: "Actions",

    render: (row: PatientRow) => <PatientActions id={row.id} />,
  },
];