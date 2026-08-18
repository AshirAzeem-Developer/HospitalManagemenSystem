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

  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
  const query = params.q ?? "";

  const { patients, totalPatients, totalPages } = await getPatients({
    page,
    limit,
    query,
  });

  return (
    <div className="min-h-screen space-y-6 p-6 text-foreground">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Patient Directory</h1>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="flex items-center gap-2 border border-border bg-background px-2 py-1">
            <List size={16} className="text-foreground" />
            <Link href="/admin/patients/grid-view">
              <LayoutGrid size={16} className="text-muted hover:text-foreground" />
            </Link>
          </div>

          <Link href="/admin/patients/NewPatient" className="w-full sm:w-auto">
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

      <Card
        label="Patient Directory"
        value={`${totalPatients} Patients`}
        hint={`Page ${page} of ${totalPages}`}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-xs">
          <PaginationSearchBar placeholder="Search patients" />
        </div>
      </div>

      <PatientsList patients={patients} />

      <div className="mt-4">
        <PaginationControlsWrapper page={page} totalPages={totalPages} limit={limit} />
      </div>
    </div>
  );
}