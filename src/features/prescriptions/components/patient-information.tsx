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
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        Patient Information
      </h2>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Patient Image */}
        <div className="flex justify-center lg:block">
          <Image
            src={image || Images.User1}
            alt={name}
            width={110}
            height={110}
            className="rounded-full border object-contain"
          />
        </div>

        {/* Patient Details */}
        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Patient Name</p>
            <p className="font-semibold text-slate-900">{name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Patient ID</p>
            <p className="font-semibold text-slate-900">{patient.id}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Age / Gender</p>
            <p className="font-semibold text-slate-900">
              {patient.date_of_birth} / {gender}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Blood Group</p>
            <p className="font-semibold text-slate-900">
              {patient.blood_group ?? "N/A"}
            </p>
          </div>

          {prescriptionDate && (
            <div>
              <p className="text-sm text-slate-500">Prescription Date</p>
              <p className="font-semibold text-slate-900">
                {new Date(prescriptionDate).toLocaleDateString("en-GB")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
