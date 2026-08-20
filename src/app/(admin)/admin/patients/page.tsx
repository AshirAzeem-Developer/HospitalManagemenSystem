import { getPatients } from "@/features/patients/actions";
import PatientsList from "@/features/patients/components/PatientsList";
import Link from "next/link";
import { List, LayoutGrid, Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PaginationSearchBar from "@/components/ui/PaginationSearchBar";
import PaginationControlsWrapper from "@/components/ui/PaginationControlsWrapper";

type Props = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
};

export default async function AdminPatientsPage({ searchParams }: Props) {
  const params = await searchParams;

  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const parsedLimit = Number.parseInt(params.limit ?? "10", 10);

  const page =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;

  const query = params.q ?? "";

  const { patients, totalPatients, totalPages } = await getPatients({
    page,
    limit,
    query,
  });

  return (
    <div className="min-h-screen space-y-6 p-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground sm:text-2xl">
              Patient Grid
            </h1>

            <Button
              variant="status-primary"
              text={`Total Patients : ${totalPatients}`}
              type="button"
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          {/* List / Grid Toggle */}
          <div className="flex items-center gap-2 border border-border bg-background px-2 py-1">
            {/* List View - Active */}
            <List size={16} className="text-blue-600" />

            {/* Grid View */}
            <Link href="/admin/patients/grid-view">
              <LayoutGrid
                size={16}
                className="text-muted hover:text-foreground"
              />
            </Link>
          </div>

          {/* New Patient */}
          <Link
            href="/admin/patients/NewPatient"
            className="w-full sm:w-auto"
          >
            <Button
              text="New Patient"
              variant="primary"
              type="button"
              className="w-full sm:w-auto"
              icon={<Plus size={18} />}
            />
          </Link>
        </div>
      </div>

      {/* Patient Summary */}
      <Card
        label="Patient Directory"
        value={`${totalPatients} Patients`}
        hint={`Page ${page} of ${totalPages}`}
      />

      {/* Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-xs">
          <PaginationSearchBar placeholder="Search patients" />
        </div>
      </div>

      {/* Patients List */}
      <PatientsList patients={patients} />

      {/* Pagination */}
      <div className="mt-4">
        <PaginationControlsWrapper
          page={page}
          totalPages={totalPages}
          limit={limit}
        />
      </div>
    </div>
  );
}