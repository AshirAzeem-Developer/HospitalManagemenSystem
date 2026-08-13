import type { PatientRow } from "./types";
import Link from "next/link";
import PatientActions from "./components/PatientActions";


export const columns = [
  {
    key: "patient",
    label: "Patient",
render: (row: PatientRow) => (
  <div className="flex items-center gap-3">

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 overflow-hidden">
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
      <p className="font-medium text-slate-900">
        {row.profile?.full_name || "-"}
      </p>

      <p className="text-xs text-slate-500">
        {row.profile?.gender || "-"}
      </p>
    </div>

  </div>
)
  },
  
{
  key: "phone",
  label: "Phone",

  render: (row: PatientRow) => (
    <span>{row.phone || "—"}</span>
  ),
},
  {
    key: "blood_group",
    label: "Blood Group",

    render: (row: PatientRow) => (
      <span>{row.blood_group || "-"}</span>
    ),
  },

  {
    key: "stay_address",
    label: "Address",

    render: (row: PatientRow) => (
      <span>{row.stay_address || "-"}</span>
    ),
  },
{
  key: "doctor",
  label: "Doctor",

 render: (row: PatientRow) => (
  <div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 overflow-hidden">

    {row.doctor?.profile?.avatar_url ? (
      <img
        src={row.doctor.profile.avatar_url }
        alt={row.doctor.profile.full_name || "Doctor"}
        className="h-full w-full object-cover"
      />
    ) : (
      row.doctor?.profile?.full_name?.charAt(0).toUpperCase() || "D"
    )}

  </div>

  <div>
    <p className="font-medium text-slate-900">
      {row.doctor?.profile?.full_name || "-"}
    </p>

    <p className="text-xs text-slate-500">
      {row.doctor?.specialization || "-"}
    </p>
  </div>
</div>
)
},

 {
  key: "status",
  label: "Status",

  render: (row: PatientRow) => (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        row.doctor?.status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {row.doctor?.status ?? "-"}
    </span>
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