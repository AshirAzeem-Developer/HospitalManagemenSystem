import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DoctorForm from "@/features/doctors/components/doctor-form";
import { ChevronLeft } from "lucide-react";
export default function AddDoctorPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#F5F6F8] -m-8">
      {/* Header */}
      <div className="mb-8 mx-auto max-w-5xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {/* <Link
            href="/admin/doctors"
            className="mb-2 flex items-center gap-2 text-sm text-slate-500 hover:text-[#2E37A4]"
          >
            <ArrowLeft size={18} />
            Back to Doctors
          </Link> */}
          <Link
            href="/admin/doctors"
            className="inline-flex items-center gap-1 text-lg font-bold text-slate-900 hover:text-[#2E37A4]"
          >
            <ChevronLeft size={20} />
            Doctor
          </Link>

          {/* <p className="mt-1 text-slate-500">
            Create a doctor profile and configure appointments.
          </p> */}
        </div>

        {/* <div className="flex gap-3">

          <button className="rounded-lg border border-slate-300 bg-white px-5 py-2 font-medium">
            Cancel
          </button>

          <button className="rounded-lg bg-[#2E37A4] px-5 py-2 font-medium text-white">
            Add Doctor
          </button>

        </div> */}
      </div>
      <div className="mx-auto max-w-5xl">
        <DoctorForm />
      </div>
    </div>
  );
}
