import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import DoctorForm from "@/features/doctors/components/doctor-form";

export default function AddDoctorPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F8] p-4 dark:bg-[#0A162A] md:p-6 -m-8">
      {/* Header */}
      <div className="mx-auto mb-8 flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin/doctors"
            className="inline-flex items-center gap-1 text-lg font-bold text-slate-900 transition-colors hover:text-[#2E37A4] dark:text-white dark:hover:text-[#8B92E8]"
          >
            <ChevronLeft size={20} />
            Doctor
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <DoctorForm />
      </div>
    </div>
  );
}