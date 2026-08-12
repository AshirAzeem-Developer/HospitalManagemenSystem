import { notFound } from "next/navigation";
import { getDoctorById } from "@/features/doctors/queries";
import ProfileForm from "@/features/doctors/components/doctor-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("EDIT DOCTOR ID:", id);

  const doctor = await getDoctorById(id);

  console.log("EDIT DOCTOR DATA:", doctor);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#F5F6F8]">
      {/* Header */}
      <div className="mb-8 mx-auto max-w-5xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

      <div className="mx-auto max-w-5xl">
        <ProfileForm doctor={doctor} />
      </div>
    </div>
  );
}
