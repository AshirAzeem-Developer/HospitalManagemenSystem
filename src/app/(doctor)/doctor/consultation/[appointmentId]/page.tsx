import { notFound } from "next/navigation";
// import { getDoctorConsultation } from "@/features/doctors/queries";

// type Props = {
//   params: Promise<{
//     appointmentId: string;
//   }>;
// };

export default async function DoctorConsultationPage(){
//   params,
// }: Props) {
//   const { appointmentId } = await params;

//   const consultation = await getDoctorConsultation(appointmentId);

//   if (!consultation) {
//     notFound();
//   }

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0A1B39] md:text-2xl">
        Consultation Page
      </h1>

      {/* <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0A1B39]">
          {consultation.patient.full_name}
        </h2>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p>
            <strong>Patient ID:</strong>{" "}
            {consultation.patient.id}
          </p>

          <p>
            <strong>Gender:</strong>{" "}
            {consultation.patient.gender ?? "Not available"}
          </p>

          <p>
            <strong>Blood Group:</strong>{" "}
            {consultation.patient.blood_group ?? "Not available"}
          </p>

          <p>
            <strong>Appointment Date:</strong>{" "}
            {consultation.appointment.appointment_date}
          </p>

          <p>
            <strong>Appointment Time:</strong>{" "}
            {consultation.appointment.time_slot}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {consultation.appointment.status}
          </p>

          <p>
            <strong>Reason:</strong>{" "}
            {consultation.appointment.reason_of_visit ??
              "Not provided"}
          </p>

          <p>
            <strong>Notes:</strong>{" "}
            {consultation.appointment.notes ??
              "Not provided"}
          </p>
        </div>
      </div> */}
    </div>
  );
}