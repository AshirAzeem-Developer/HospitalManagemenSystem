"use client";
import ContactInformation from "./contact-info";
import AddressInformation from "./address-info";
import AppointmentSchedule from "./appointment-schedule";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import { useState } from "react";
import type { ContactInfo } from "../types";
import type { AddressInfo } from "../types";
import { contactInfoSchema } from "../schema";
import { AddressInfoSchema } from "../schema";
import { addDoctorAction, updateDoctorAction } from "../actions";
import type { DoctorSchedule } from "../types";
import { DoctorSchedulesSchema, editContactInfoSchema } from "../schema";
import Link from "next/link";
import { useRouter } from "next/navigation";

type EditDoctorData = {
  id: string;
  profile_id: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string | null;
  bio: string | null;
  consultation_fee: number;
  status: string;
  profile: {
    full_name: string;
    avatar_url: string | null;
    gender: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
  };
  doctor_schedules: DoctorSchedule[];
};
type Props = {
  doctor: EditDoctorData;
};
function formatPhoneForForm(phone: string) {
  if (phone.startsWith("92")) {
    return `0${phone.slice(2)}`;
  }

  return phone;
}
export default function ProfileForm({ doctor }: Props) {
  const isEdit = !!doctor;
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: doctor?.profile.full_name ?? "",
    email: doctor?.email ?? "",
    password: "",
    phone: formatPhoneForForm(doctor?.phone ?? ""),
    gender: doctor?.profile.gender ?? "",
    specialization: doctor?.specialization ?? "",
    qualification: doctor?.qualification ?? "",
    consultationFee: doctor?.consultation_fee ?? "",
    status: doctor?.status ?? "available",
    bio: doctor?.bio ?? "",
    profileImage: null,
  });
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    country: doctor?.profile.country ?? "",
    state: doctor?.profile.state ?? "",
    city: doctor?.profile.city ?? "",
  });
  const [schedules, setSchedules] = useState<DoctorSchedule[]>(
    doctor?.doctor_schedules.map((schedule) => ({
      id: schedule.id,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime?.slice(0, 5) ?? "",
      endTime: schedule.endTime?.slice(0, 5) ?? "",
      slotDurationMinutes: schedule.slotDurationMinutes,
      isActive: schedule.isActive,
    })) ?? [],
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const handleSubmit = async () => {
    setErrors({});

    const parsedContact = (
      isEdit ? editContactInfoSchema : contactInfoSchema
    ).safeParse(contactInfo);

    if (!parsedContact.success) {
      const fieldErrors = parsedContact.error.flatten().fieldErrors;

      console.log("CONTACT ERRORS:", fieldErrors);

      setErrors(fieldErrors);

      toast.error("Please fix the errors in Contact Information.");

      return;
    }

    const parsedAddress = AddressInfoSchema.safeParse(addressInfo);

    if (!parsedAddress.success) {
      const fieldErrors = parsedAddress.error.flatten().fieldErrors;

      console.log("ADDRESS ERRORS:", fieldErrors);

      setErrors(fieldErrors);

      toast.error("Please fix the errors in Address Information.");

      return;
    }

    if (schedules.length === 0) {
      const message = "Please add at least one appointment schedule.";

      setErrors((prev) => ({
        ...prev,
        schedule: [message],
      }));

      toast.error(message);

      return;
    }
    const parsedSchedules = DoctorSchedulesSchema.safeParse(schedules);

    if (!parsedSchedules.success) {
      const scheduleErrors: Record<string, string[]> = {};

      parsedSchedules.error.issues.forEach((issue) => {
        const [index, field] = issue.path;

        if (typeof index === "number" && typeof field === "string") {
          const schedule = schedules[index];

          if (!schedule) return;

          const key = `schedule.${schedule.dayOfWeek}.${field}`;

          scheduleErrors[key] = [issue.message];
        }
      });

      setErrors((prev) => ({
        ...prev,
        ...scheduleErrors,
      }));

      toast.error("Please fix the appointment schedule.");

      return;
    }

    let result;

    if (isEdit) {
      result = await updateDoctorAction(doctor.id, doctor.profile_id, {
        contact: parsedContact.data,
        address: parsedAddress.data,
        schedules,
      });
    } else {
      result = await addDoctorAction({
        contact: parsedContact.data,
        address: parsedAddress.data,
        schedules,
      });
    }

    console.log("Result...", result);

    if (!result.success) {
      toast.error(
        result.error ||
          (isEdit
            ? "Unable to update doctor. Please try again."
            : "Unable to add doctor. Please try again."),
      );

      return;
    }
    toast.success(
      isEdit ? "Doctor updated successfully!" : "Doctor added successfully!",
    );

    router.push("/admin/doctors");
  };
  return (
    <div className="flex max-w-4xl justify-center bg-white dark:bg-[#0A162A]">
      <div className="w-full rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-[#0A162A]">
        <h2 className="mb-3 border-b border-gray-300 p-2 py-4 text-lg font-semibold text-[#0A1B39] dark:border-gray-700 dark:text-white">
          {isEdit ? "Edit Doctor" : "New Doctor"}
        </h2>
        <ContactInformation
          contactInfo={contactInfo}
          setContactInfo={setContactInfo}
          errors={errors}
          setErrors={setErrors}
          isEdit={isEdit}
          avatarUrl={doctor?.profile.avatar_url}
        />
        <AddressInformation
          addressInfo={addressInfo}
          setAddressInfo={setAddressInfo}
          errors={errors}
          setErrors={setErrors}
        />
        <AppointmentSchedule
          schedules={schedules}
          setSchedules={setSchedules}
          errors={errors}
          setErrors={setErrors}
        />

        <div className="flex justify-end gap-3 border-[#E5E7EB] pt-5 dark:border-gray-700">
          <Link href="/admin/doctors">
            <Button variant="ghost" text="Cancel" />
          </Link>
          <Button
            variant="primary"
            text={isEdit ? "Edit Doctor" : "Add Doctor"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}