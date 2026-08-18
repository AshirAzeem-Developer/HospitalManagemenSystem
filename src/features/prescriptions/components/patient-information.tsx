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
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">
        Patient Information
      </h2>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Patient Image */}
        <div className="flex justify-center lg:block">
          <div className="relative h-[110px] w-[110px] overflow-hidden rounded-full border border-[var(--border)] bg-[var(--hover)] shadow-sm">
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
        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-[var(--muted)]">Patient Name</p>
            <p className="font-semibold text-[var(--foreground)]">{name}</p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted)]">Patient ID</p>
            <p className="font-semibold text-[var(--foreground)]">{patient.id}</p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted)]">Age / Gender</p>
            <p className="font-semibold text-[var(--foreground)]">
              {patient.date_of_birth} / {gender}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted)]">Blood Group</p>
            <p className="font-semibold text-[var(--foreground)]">
              {patient.blood_group ?? "N/A"}
            </p>
          </div>

          {prescriptionDate && (
            <div>
              <p className="text-sm text-[var(--muted)]">Prescription Date</p>
              <p className="font-semibold text-[var(--foreground)]">
                {new Date(prescriptionDate).toLocaleDateString("en-GB")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
