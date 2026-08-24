import Image from "next/image";
import { Images } from "@/assets";

import { Patient, PrescriptionPatient, PrescriptionProfile } from "../types";

interface PatientInformationProps {
  patient: Patient | PrescriptionPatient;
  profile?: PrescriptionProfile;
  prescriptionDate?: string;
}

export default function PatientInformation({
  patient,
  profile,
  prescriptionDate,
}: PatientInformationProps) {
  const name =
    "full_name" in patient
      ? patient.full_name
      : (profile?.full_name ?? "Unknown Patient");

  const gender =
    "gender" in patient ? patient.gender : (profile?.gender ?? "N/A");

  const image =
    "image" in patient ? patient.image : (profile?.avatar_url ?? null);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:pb-5 print:shadow-none">
      <h2 className="mb-5 text-lg font-semibold text-[var(--foreground)] sm:text-xl print:text-black">
        Patient Information
      </h2>

      <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center">
        {/* Patient Image */}
        <div className="flex justify-center lg:block">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--hover)] shadow-sm sm:h-[110px] sm:w-[110px] print:hidden">
            <Image
              src={image || Images.User1}
              alt={name}
              fill
              sizes="110px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Patient Details */}
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 print:grid-cols-3 print:gap-x-8 print:gap-y-4">
          <div>
            <p className="text-xs text-[var(--muted)] print:text-gray-600">Patient Name</p>
            <p className="font-semibold text-[var(--foreground)] print:text-black">{name}</p>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)] print:text-gray-600">Patient ID</p>
            <p className="font-semibold text-[var(--foreground)] print:text-black">{patient.id}</p>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)] print:text-gray-600">Age / Gender</p>
            <p className="font-semibold text-[var(--foreground)] print:text-black">
              {patient.date_of_birth} / {gender}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)] print:text-gray-600">Blood Group</p>
            <p className="font-semibold text-[var(--foreground)] print:text-black">
              {patient.blood_group ?? "N/A"}
            </p>
          </div>

          {prescriptionDate && (
            <div>
              <p className="text-xs text-[var(--muted)] print:text-gray-600">Prescription Date</p>
              <p className="font-semibold text-[var(--foreground)] print:text-black">
                {new Date(prescriptionDate).toLocaleDateString("en-GB")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
