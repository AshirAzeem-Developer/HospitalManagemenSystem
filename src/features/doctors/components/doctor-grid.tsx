import type { Doctor } from "@/features/doctors/types";
import DoctorCard from "./doctor-card";

type Props = {
  doctors: Doctor[];
};

export default function DoctorGrid({ doctors }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
        />
      ))}
    </div>
  );
}