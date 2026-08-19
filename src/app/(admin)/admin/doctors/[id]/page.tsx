import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { getDoctorById } from "@/features/doctors/queries";
import DoctorDetailHeader from "@/features/doctors/components/doctor-detail-header";
import DoctorAvailability from "@/features/doctors/components/doctor-availability";
import DoctorAbout from "@/features/doctors/components/doctor-about";
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DoctorDetailPage({ params }: PageProps) {
  const { id } = await params;

  const doctor = await getDoctorById(id);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] p-6">
        <Link
          href="/admin/doctors"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-[#2E37A4]"
        >
          <ChevronLeft className="h-4 w-4" />
          Doctors
        </Link>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            Doctor not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The doctor you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] p-4 md:p-6 -m-8">
      {/* Back */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin/doctors"
            className="inline-flex items-center gap-1 text-lg font-bold text-slate-900 hover:text-[#2E37A4]"
          >
            <ChevronLeft size={20} />
            Doctor
          </Link>
        </div>
      </div>

      {/* Page Heading */}
      <h1 className="mt-3 text-xl font-semibold text-[#0A1B39]">
        Doctor Details
      </h1>

      {/* Doctor Header */}
      <div className="mt-4">
        <DoctorDetailHeader doctor={doctor} />
      </div>

      {/* Main Details */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* LEFT — 2/3 */}
        <div className="space-y-5 lg:col-span-2">
          {/* Availability */}
          <DoctorAvailability schedules={doctor.doctor_schedules} />

          {/* Short Bio */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-semibold text-[#0A1B39] sm:text-lg">
              Short Bio
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {doctor.bio || "No bio available for this doctor."}
            </p>
          </div>
        </div>

        {/* RIGHT — 1/3 */}
        <div className="lg:col-span-1 mt-5">
          <DoctorAbout doctor={doctor} />
        </div>
      </div>
    </div>
  );
}
