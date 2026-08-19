import PrescriptionTable from "@/features/prescriptions/components/prescription-table";
import {
  getDoctorPrescriptions,
} from "@/features/prescriptions/actions";
import PaginationControlsWrapper from "@/components/ui/PaginationControlsWrapper";

type Props = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
};

export default async function PrescriptionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const parsedLimit = Number.parseInt(params.limit ?? "10", 10);

  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
  const query = params.q ?? "";

  const result = await getDoctorPrescriptions({ page, limit, query });

  if (!result.success) {
    return <p className="p-6 text-foreground">{result.message}</p>;
  }

  return (
    <section className="space-y-4">
      <PrescriptionTable prescriptions={result.data ?? []} />

      <PaginationControlsWrapper
        page={page}
        totalPages={result.totalPages ?? 1}
        limit={limit}
      />
    </section>
  );
}