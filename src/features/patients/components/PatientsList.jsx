"use client";

import { useState } from "react";
import Table from "@/components/ui/table";
import { columns } from "@/features/patients/patient-columns";
import Search from "./Search";

export default function PatientsList({ patients }) {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.profile?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <Search search={search} setSearch={setSearch} />

      {/* Table */}
      <Table columns={columns} data={filteredPatients} />
    </div>
  );
}