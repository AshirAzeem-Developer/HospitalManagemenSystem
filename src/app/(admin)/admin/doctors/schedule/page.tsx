import { getDoctorScheduleList } from "@/features/doctors/queries";
import DoctorScheduleTable from "@/features/doctors/components/doctor-schedule-table";

export default async function DoctorSchedulePage() {
  const doctors = await getDoctorScheduleList();

  return (
    <div className="flex h-[calc(100vh-64px)] min-h-0 min-w-0 flex-col overflow-hidden bg-[#F5F6F8] p-4 md:p-6">
      <DoctorScheduleTable doctors={doctors} />
    </div>
  );
}