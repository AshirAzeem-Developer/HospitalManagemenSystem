import Image, { StaticImageData } from "next/image";
import { Images } from "@/assets";
import { Patient } from "../types";

interface PatientInformationProps {
  patient: Patient;
}

export default function PatientInformation({
  patient,
}: PatientInformationProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        Patient Information
      </h2>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Patient Image */}
        <div className="flex justify-center lg:block">
          <Image
            src={patient.image ?? Images.User1}
            alt={patient.full_name}
            width={110}
            height={110}
            className="rounded-full border object-contain"
          />
        </div>

        {/* Patient Details */}
        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Patient Name</p>
            <p className="font-semibold text-slate-900">{patient.full_name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Patient ID</p>
            <p className="font-semibold text-slate-900">{patient.id}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Age / Gender</p>
            <p className="font-semibold text-slate-900">
              {patient.date_of_birth} / {patient.gender}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Blood Group</p>
            <p className="font-semibold text-slate-900">
              {patient.blood_group}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Prescription Date</p>
            <p className="font-semibold text-slate-900">
              {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
