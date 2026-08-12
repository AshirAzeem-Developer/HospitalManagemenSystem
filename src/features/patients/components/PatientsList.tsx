"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { columns } from "@/features/patients/patient-columns";
import Search from "./Search";
import type { PatientRow } from "@/features/patients/types";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";

type PatientsListProps = {
  patients: PatientRow[];
};

const ITEMS_PER_PAGE = 5;

export default function PatientsList({
  patients,
}: PatientsListProps) {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.profile?.full_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredPatients.length / ITEMS_PER_PAGE
  );

  const {
    currentPage,
    goToPage,
  } = usePagination(totalPages);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      goToPage(1);
    }
  }, [currentPage, totalPages, goToPage]);

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedPatients = filteredPatients.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      <Search
        search={search}
        setSearch={setSearch}
      />

      <Table
        columns={columns}
        data={paginatedPatients}
      />

      <Pagination
        totalPages={totalPages}
      />
    </div>
  );
}