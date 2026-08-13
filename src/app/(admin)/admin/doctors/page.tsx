import DoctorGrid from "@/features/doctors/components/doctor-grid";
import { getDoctors } from "@/features/doctors/queries";
import Button from "@/components/ui/button";
import { Filter, LayoutGrid, Plus, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};
export default async function AdminDoctorsPage({ searchParams }: Props) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page ?? "1"));

  const { doctors, totalDoctors, totalPages } = await getDoctors(currentPage);
  return (
    <div className="bg-[#F5F6F8] p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left Section */}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold">Doctor Grid</h2>

           <button className="rounded-xl border-2 border-[#2E37A4] bg-[#ECEDF7] px-3 py-1 text-sm font-semibold text-[#2E37A4] md:text-base">
            {`Total Doctors: ${totalDoctors}`}
          </button>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-3">
          {/* <Button
            text="Filter"
            variant="ghost"
            icon={<Filter className="h-4 w-4" />}
          />

          <Button
            text=""
            variant="ghost"
            icon={<LayoutGrid className="h-4 w-4" />}
          /> */}

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
      <Pagination totalPages={totalPages} />

      {/* <div className="flex justify-center pt-6">
        <Button
          text="Load More"
          variant="ghost"
          icon={<LoaderCircle className="h-4 w-4 animate-spin" />}
        />
      </div> */}
    </div>
  );
}
