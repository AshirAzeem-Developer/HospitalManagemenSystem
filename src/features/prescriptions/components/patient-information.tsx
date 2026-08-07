import Image, { StaticImageData } from "next/image";
import { Images } from "@/assets";

interface PatientInformationProps {
  patient: {
    image: string | StaticImageData | null;
    name: string;
    id: string;
    age: number;
    gender: string;
    bloodGroup: string | null;
  };
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
            alt={patient.name}
            width={110}
            height={110}
            className="rounded-full border object-cover"
          />
        </div>

        {/* Patient Details */}
        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Patient Name</p>
            <p className="font-semibold text-slate-900">{patient.name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Patient ID</p>
            <p className="font-semibold text-slate-900">{patient.id}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Age / Gender</p>
            <p className="font-semibold text-slate-900">
              {patient.age} Years / {patient.gender}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Blood Group</p>
            <p className="font-semibold text-slate-900">{patient.bloodGroup}</p>
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
