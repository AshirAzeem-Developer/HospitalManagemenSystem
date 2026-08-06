"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Camera } from "lucide-react";
import { updateProfileAction } from "@/features/admin/actions";

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "21px",
  letterSpacing: "0%",
  color: "#0A1B39",
};

const inputClass =
  "w-full rounded-lg px-3 py-2 text-[14px] font-normal text-[#667085] outline-none focus:border-[#4F46E5]";

const inputStyle: React.CSSProperties = {
  border: "1px solid #E7E8EB",
  fontWeight: 400,
  fontSize: "14px",
  color: "#667085",
};

const rowClass = "grid grid-cols-[140px_minmax(0,1fr)] items-center gap-4";

type ProfileData = {
  full_name?: string;
  avatar_url?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  gender?: string | null;
} | null;

export default function ProfileForm({
  initialData,
  userEmail,
}: {
  initialData: ProfileData;
  userEmail: string;
}) {
  const [fullName, setFullName] = useState(initialData?.full_name || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [state, setState] = useState(initialData?.state || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [gender, setGender] = useState(initialData?.gender || "");

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result?.error) {
        setMessage("Error: " + result.error);
      } else {
        setMessage("Profile updated successfully!");
      }
    });
  }

  return (
    <form action={handleSubmit} className="w-full max-w-6xl">
      <h2 className="text-base font-semibold text-[#0A1B39] mb-3">
        Basic Information
      </h2>
      <div className="border-b border-[#E5E7EB] mb-6" />

      {/* Profile Image */}
      <div className="flex items-center gap-6 mb-8">
        <label style={labelStyle}>Profile Image</label>
        <div className="relative h-16 w-16">
          <Image
            src={initialData?.avatar_url || "/Images/admin.png"}
            alt="Profile"
            fill
            className="rounded-full object-cover border border-[#E5E7EB]"
          />
          <button
            type="button"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#4F46E5] shadow-sm"
          >
            <Camera size={12} className="text-white" />
          </button>
        </div>
      </div>

      {/* Full Name + Gender */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className={rowClass}>
          <label style={labelStyle}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className={rowClass}>
          <label style={labelStyle}>Gender</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={inputClass}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Email (read-only) */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className={rowClass}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={userEmail}
            disabled
            className={`${inputClass} bg-gray-50 cursor-not-allowed`}
            style={inputStyle}
          />
        </div>
      </div>

      <h2 className="text-base font-semibold text-[#0A1B39] mb-5">
        Address Information
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className={rowClass}>
          <label style={labelStyle}>Country</label>
          <input
            type="text"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className={rowClass}>
          <label style={labelStyle}>State</label>
          <input
            type="text"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className={rowClass}>
          <label style={labelStyle}>City</label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div />
      </div>

      {message && (
        <p
          className={`mb-4 text-sm ${
            message.startsWith("Error") ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-5 border-t border-[#E5E7EB]">
        <button
          type="button"
          className="rounded-lg border border-[#D0D5DD] px-5 py-2 text-sm font-medium text-[#344054] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#2E37A4] px-5 py-2 text-sm font-medium text-white hover:bg-[#252d8c] transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}