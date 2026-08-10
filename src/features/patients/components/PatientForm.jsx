"use client";

import { useState ,useEffect} from "react";
import { useRouter } from "next/navigation";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import ImageUpload from "./ImageUpload";
import { createPatient ,updatePatient } from "@/features/patients/actions";
import { RefreshCw } from "lucide-react";


/**
 * @param {{
 * doctors?: any[],
 * patient?: any,
 * patientId?: string
 * }} props
 */
export default function PatientForm({ 
  doctors = [], 
  patient ,
  patientId
})  {
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    email:"",
    password:"",
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
      full_name: patient.profile?.full_name || "",
      email: patient.email || "",
      password: "",
      phone: patient.phone || "",
      gender: patient.profile?.gender || "",
      date_of_birth: patient.date_of_birth || "",
      blood_group: patient.blood_group || "",
      primary_doctor_id: patient.doctor?.id || "",
      stay_address: patient.stay_address || "",
      permanent_address: patient.permanent_address || "",
      country: patient.profile?.country || "",
      state: patient.profile?.state || "",
      city: patient.profile?.city || "",
    });
  }
}, [patient]);
async function handleSubmit(e) {
  e.preventDefault();

  console.log("Sending Data:", form);

  setLoading(true);

  try {

    if (patientId) {
      // Edit mode
      await updatePatient(patientId, form);

    } else {
      // Create mode
      await createPatient({
        ...form,
        imageFile
      });
    }

    router.push("/admin/patients");

  } catch (err) {
    console.error(err);
    alert("something wrong: " + err.message);

  } finally {
    setLoading(false);
  }
}
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
function generatePassword() {
  const letters = "abcdefghijkmnpqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#";

  let password = "";

  // 4 letters
  for (let i = 0; i < 4; i++) {
    password +=
      letters[Math.floor(Math.random() * letters.length)];
  }

  // 4 numbers
  for (let i = 0; i < 4; i++) {
    password +=
      numbers[Math.floor(Math.random() * numbers.length)];
  }

  // 1 symbol
  password +=
    symbols[Math.floor(Math.random() * symbols.length)];

  handleChange("password", password);
}
 
const doctorOptions = doctors.map((d) => ({
  label: d.profile?.full_name || "Unknown",
  value: d.id,
}));

console.log("OPTIONS", doctorOptions);
console.log("SELECTED", form.primary_doctor_id);


  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-0">
        <div className="w-full bg-white p-4 sm:p-6 lg:p-8 shadow-sm rounded-lg lg:rounded-none">

          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Patient Information</h2>

          <div className="mt-6">
            <ImageUpload onFileSelect={setImageFile} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
            <FormInput
              label="Full Name"
              required
              placeholder="Enter full name"
              value={form.full_name}
              type="full_name"
              onChange={(e) => handleChange("full_name", e.target.value)}
            />
          <FormInput
            label="Email"
            type="email"
            placeholder="Email cannot be changed"
            value={form.email}
            readOnly={!!patient}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={form.password}
              onChange={(e)=>handleChange("password", e.target.value)}
              placeholder={patientId ? "Leave blank to keep unchanged" : "Enter or generate a password"}
              className="flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-slate-50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
           

            <button
              type="button"
              onClick={generatePassword}
              title="Generate Password"
              aria-label="Generate Password"
              className="shrink-0 inline-flex items-center justify-center h-[42px] w-[42px] rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100 hover:border-blue-300 active:scale-[0.95]"
            >
              <RefreshCw size={17} />
            </button>
          </div>
       </div>
           <FormInput
              label="Phone Number"
              required
              type="tel"
              placeholder="Enter phone number"
              value={form.phone}
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
              onChange={(e) => handleChange("gender", e.target.value)}
            />

            <FormInput
              label="Date of Birth"
              required
              type="date"
              value={form.date_of_birth}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
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
              onChange={(e) => handleChange("blood_group", e.target.value)}
            />

            <FormSelect
              label="Primary Doctor"
              required
              options={doctorOptions}
              value={form.primary_doctor_id}
              onChange={(e) => handleChange("primary_doctor_id", e.target.value)}
            />
          </div>

          <h2 className="mt-8 sm:mt-10 border-t pt-6 sm:pt-8 text-lg sm:text-xl font-semibold text-slate-900">
            Address Information
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
            <FormInput
              label="Stay Address"
              required
              value={form.stay_address}
              onChange={(e) => handleChange("stay_address", e.target.value)}
            />

            <FormInput
              label="Permanent Address"
              required
              value={form.permanent_address}
              onChange={(e) => handleChange("permanent_address", e.target.value)}
            />

            <FormInput
              label="Country"
              required
              type="text"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />

            <FormInput
              label="State"
              required
              type="text"
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />

            <FormInput
              label="City"
              required
              type="text"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/patients")}
            className="w-full sm:w-auto rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:opacity-50"
          >
            {loading 
              ? "Saving..." 
              : patientId 
                ? "Update Patient" 
                : "Create Patient"
            }
          </button>
        </div>
      </div>
    </form>
  );
}