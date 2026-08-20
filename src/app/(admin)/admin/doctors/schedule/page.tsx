import { getDoctorScheduleList } from "@/features/doctors/queries";
import Link from "next/link";
import DoctorScheduleTable from "@/features/doctors/components/doctor-schedule-table";
import { ChevronLeft } from "lucide-react";

export default async function DoctorSchedulePage() {
  const doctors = await getDoctorScheduleList();

  return (
    <div
      className="
        flex
        h-[calc(100vh-64px)]
        min-h-0
        min-w-0
        flex-col
        overflow-hidden
        bg-[#F5F6F8]
        p-4
        md:p-6
        -m-8
        dark:bg-[#0A162A]
      "
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin/doctors"
            className="
              inline-flex
              items-center
              gap-1
              text-lg
              font-bold
              text-slate-900
              hover:text-[#2E37A4]
              dark:text-gray-100
              dark:hover:text-[#6675E8]
            "
          >
            <ChevronLeft size={20} />
            Doctor
          </Link>
        </div>
      </div>

      {/* Schedule Table */}
      <DoctorScheduleTable doctors={doctors} />
    </div>
  );
}