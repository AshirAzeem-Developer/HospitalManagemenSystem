"use client";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/button";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import ImageUpload from "./ImageUpload";

import {
  createPatient,
  updatePatient,
  type Doctor,
} from "@/features/patients/actions";

import { patientSchema } from "@/features/patients/schema";

type PatientFormData = {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  primary_doctor_id: string;
  stay_address: string;
  permanent_address: string;
  country: string;
  state: string;
  city: string;
};

type PatientFormPatient = {
  id?: string;
  profile_id?: string;

  profile?: {
    full_name?: string;
    gender?: string;
    country?: string;
    state?: string;
    city?: string;
    avatar_url?: string | null;
  } | null;

  email?: string;
  phone?: string;

  date_of_birth?: string;
  blood_group?: string;

  doctor?: {
    id?: string;
    specialization?: string;
    profile?: {
      full_name?: string;
    }[] | null;
  } | null;

  stay_address?: string | null;
  permanent_address?: string | null;
};

type PatientFormProps = {
  doctors?: Doctor[];
  patient?: PatientFormPatient | null;
  patientId?: string;
};

export default function PatientForm({
  doctors = [],
  patient,
  patientId,
}: PatientFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<
    Partial<Record<keyof PatientFormData, string>>
  >({});

  const [form, setForm] = useState<PatientFormData>({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    blood_group: "",
    primary_doctor_id: "",
    stay_address: "",
    permanent_address: "",
    country: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    if (patient) {
      setForm({
        full_name: patient.profile?.full_name ?? "",
        email: patient.email ?? "",
        password: "",
        phone: patient.phone ?? "",
        gender: patient.profile?.gender ?? "",
        date_of_birth: patient.date_of_birth ?? "",
        blood_group: patient.blood_group ?? "",
        primary_doctor_id: patient.doctor?.id ?? "",
        stay_address: patient.stay_address ?? "",
        permanent_address: patient.permanent_address ?? "",
        country: patient.profile?.country ?? "",
        state: patient.profile?.state ?? "",
        city: patient.profile?.city ?? "",
      });
    }
  }, [patient]);

  function handleChange(
    field: keyof PatientFormData,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  function generatePassword() {
    const letters = "abcdefghijkmnpqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#";

    let password = "";

    for (let i = 0; i < 4; i++) {
      password +=
        letters[Math.floor(Math.random() * letters.length)];
    }

    for (let i = 0; i < 4; i++) {
      password +=
        numbers[Math.floor(Math.random() * numbers.length)];
    }

    password +=
      symbols[Math.floor(Math.random() * symbols.length)];

    handleChange("password", password);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const result = patientSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof PatientFormData, string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof PatientFormData;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (patientId) {
        await updatePatient(patientId, form);
        toast.success("Patient updated successfully");
      } else {
        await createPatient({
          ...form,
          imageFile,
        });
        toast.success("Patient added successfully");
      }

      router.push("/admin/patients");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const doctorOptions = doctors.map((doctor: any) => ({
    label: doctor.profile?.full_name || "Unknown",
    value: doctor.id,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-0">
        <div className="w-full rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 sm:p-6 lg:rounded-none lg:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
            Patient Information
          </h2>

          <div className="mt-6">
            <ImageUpload onFileSelect={setImageFile} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
            <FormInput
              label="Full Name"
              required
              placeholder="Enter full name"
              value={form.full_name}
              type="text"
              error={errors.full_name}
              onChange={(e) =>
                handleChange("full_name", e.target.value)
              }
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="Email cannot be changed"
              value={form.email}
              readOnly={!!patient}
              error={errors.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                Password
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  placeholder={
                    patientId
                      ? "Leave blank to keep unchanged"
                      : "Enter or generate a password"
                  }
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={generatePassword}
                  title="Generate Password"
                  aria-label="Generate Password"
                  className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 active:scale-[0.95] dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400 dark:hover:border-blue-800 dark:hover:bg-blue-900"
                >
                  <RefreshCw size={17} />
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <FormInput
              label="Phone Number"
              required
              type="tel"
              placeholder="Enter phone number"
              value={form.phone}
              error={errors.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value)
              }
            />

            <FormSelect
              label="Gender"
              required
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              value={form.gender}
              onChange={(e) =>
                handleChange("gender", e.target.value)
              }
            />

            <FormInput
              label="Date of Birth"
              required
              type="date"
              value={form.date_of_birth}
              error={errors.date_of_birth}
              onChange={(e) =>
                handleChange("date_of_birth", e.target.value)
              }
            />

            <FormSelect
              label="Blood Group"
              required
              options={[
                { label: "A+", value: "A+" },
                { label: "A-", value: "A-" },
                { label: "B+", value: "B+" },
                { label: "B-", value: "B-" },
                { label: "AB+", value: "AB+" },
                { label: "AB-", value: "AB-" },
                { label: "O+", value: "O+" },
                { label: "O-", value: "O-" },
              ]}
              value={form.blood_group}
              onChange={(e) =>
                handleChange("blood_group", e.target.value)
              }
            />

            <FormSelect
              label="Primary Doctor"
              required
              options={doctorOptions}
              value={form.primary_doctor_id}
              onChange={(e) =>
                handleChange(
                  "primary_doctor_id",
                  e.target.value
                )
              }
            />
          </div>

          <h2 className="mt-8 border-t border-slate-200 pt-6 text-lg font-semibold text-slate-900 dark:border-gray-700 dark:text-white sm:mt-10 sm:pt-8 sm:text-xl">
            Address Information
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
            <FormInput
              label="Stay Address"
              required
              value={form.stay_address}
              error={errors.stay_address}
              onChange={(e) =>
                handleChange("stay_address", e.target.value)
              }
            />

            <FormInput
              label="Permanent Address"
              required
              value={form.permanent_address}
              error={errors.permanent_address}
              onChange={(e) =>
                handleChange(
                  "permanent_address",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Country"
              required
              value={form.country}
              error={errors.country}
              onChange={(e) =>
                handleChange("country", e.target.value)
              }
            />

            <FormInput
              label="State"
              required
              value={form.state}
              error={errors.state}
              onChange={(e) =>
                handleChange("state", e.target.value)
              }
            />

            <FormInput
              label="City"
              required
              value={form.city}
              error={errors.city}
              onChange={(e) =>
                handleChange("city", e.target.value)
              }
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end lg:mt-10">
          <Button
            type="button"
            variant="ghost"
            text="Cancel"
            onClick={() => router.push("/admin/patients")}
            className="w-full sm:w-auto"
          />

          <Button
            type="submit"
            variant="primary"
            text={
              loading
                ? "Saving..."
                : patientId
                  ? "Update Patient"
                  : "Create Patient"
            }
            disabled={loading}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </form>
  );
}