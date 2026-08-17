import DoctorGrid from "@/features/doctors/components/doctor-grid";
import { getDoctors, getDoctorsParams } from "@/features/doctors/queries";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import PaginationControlsWrapper from "@/components/ui/PaginationControlsWrapper";
import PaginationSearchBar from "@/components/ui/PaginationSearchBar";

type Props = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
};

export default async function AdminDoctorsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { page, limit, q } = getDoctorsParams(params);

  const { doctors, totalDoctors, totalPages } = await getDoctors({
    page,
    limit,
    query: q,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Doctors</h1>
      <p className="mt-1 text-sm text-muted">Manage physicians and their availability.</p>

      <div className="mt-6 space-y-4">
        <Card
          label="Doctor Directory"
          value={`${totalDoctors} Doctors`}
          hint={`Page ${page} of ${totalPages}`}
        />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-xs">
            <PaginationSearchBar placeholder="Search doctors" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/doctors/add">
              <Button
                text="New Doctor"
                variant="primary"
                icon={<Plus size={18} />}
              />
            </Link>
          </div>
        </div>

        <DoctorGrid doctors={doctors} />

        <div className="mt-4">
          <PaginationControlsWrapper
            page={page}
            totalPages={totalPages}
            limit={limit}
          />
        </div>
      </div>
    </div>
  );
}
