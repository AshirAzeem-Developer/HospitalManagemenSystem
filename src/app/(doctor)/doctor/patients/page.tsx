import { getMyPatients } from "@/features/doctors/queries";
import DoctorPatientTable from "@/features/doctors/components/doctor-patient-table";

export default async function DoctorPatientsPage() {
  const patients = await getMyPatients();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 pb-5">
        <h1
          className="
            text-xl font-semibold
            text-[#0A1B39]
            dark:text-[#F1F5F9]
            md:text-2xl
          "
        >
          My Patients
        </h1>

        <span
          className="
            rounded-md
            bg-[#EEF0FF]
            px-2.5 py-1
            text-xs font-medium
            text-[#2E37A4]

            dark:bg-[#312E81]/30
            dark:text-[#A5B4FC]

            md:text-sm
          "
        >
          Total Patients : {patients.length}
        </span>
      </div>

      {/* Patients */}
      {patients.length > 0 ? (
        <DoctorPatientTable patients={patients} />
      ) : (
        <div
          className="
            flex min-h-[300px]
            items-center justify-center
            rounded-lg
            border border-gray-200
            bg-white
            px-6 py-10
            text-center

            dark:border-[#2A3850]
            dark:bg-[#0A162A]
          "
        >
          <div>
            <p
              className="
                text-sm font-medium
                text-gray-700
                dark:text-[#CBD5E1]
              "
            >
              No patients found
            </p>

            <p
              className="
                mt-1 text-sm
                text-gray-500
                dark:text-[#94A3B8]
              "
            >
              Patients with appointments will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}