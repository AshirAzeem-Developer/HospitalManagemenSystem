"use client";

import Image from "next/image";
import { useState, useTransition, useRef } from "react";
import { Camera } from "lucide-react";
import { updateProfileAction, uploadAvatarAction } from "@/features/admin/actions";

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "21px",
  letterSpacing: "0%",
};

const labelClass = "text-[#0A1B39] dark:!text-[#F8FAFC]";

const inputClass =
  "w-full rounded-lg px-3 py-2 text-[14px] font-normal text-[#0A1B39] dark:text-[#F8FAFC] dark:bg-[#121C31] dark:border-[#3A4A63] outline-none focus:border-[#4F46E5] placeholder:text-[#98A2B3] dark:placeholder:text-[#94A3B8]";

const inputStyle: React.CSSProperties = {
  border: "1px solid #98A2B3",
  fontWeight: 400,
  fontSize: "14px",
};

const rowClass =
  "flex flex-col sm:grid sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center gap-1.5 gap-x-4";

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

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar_url || null
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const result = await uploadAvatarAction(formData);

    setIsUploadingAvatar(false);

    if (result?.error) {
      setMessage("Error: " + result.error);
      setAvatarPreview(initialData?.avatar_url || null);
    } else if (result?.url) {
      setAvatarPreview(result.url);
      setMessage("Profile picture updated!");
    }
  }

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

  function handleCancel() {
    setFullName(initialData?.full_name || "");
    setCountry(initialData?.country || "");
    setState(initialData?.state || "");
    setCity(initialData?.city || "");
    setGender(initialData?.gender || "");
    setAvatarPreview(initialData?.avatar_url || null);
    setMessage(null);
  }

  return (
    <form action={handleSubmit} className="w-full max-w-6xl overflow-hidden">
      <h2 className="text-base font-semibold text-[#0A1B39] dark:text-[#F8FAFC] mb-3">
        Basic Information
      </h2>
      <div className="border-b border-[#E5E7EB] dark:border-[#2A3850] mb-6" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-8">
        <label style={labelStyle} className={labelClass}>
          Profile Image <span className="text-red-500">*</span>
        </label>
        <div className="relative h-16 w-16">
          <Image
            src={avatarPreview || "/Images/admin.png"}
            alt="Profile"
            fill
            className="rounded-full object-cover border border-[#E5E7EB] dark:border-[#3A4A63]"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-[#152035] bg-[#4F46E5] shadow-sm hover:bg-[#3d36c4] disabled:opacity-50"
          >
            <Camera size={12} className="text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 mb-5">
        <div className={rowClass}>
          <label style={labelStyle} className={labelClass}>
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
          <label style={labelStyle} className={labelClass}>
            Gender  <span className="text-red-500">*</span>
          </label>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 mb-8">
        <div className={rowClass}>
          <label style={labelStyle} className={labelClass}>
            Email  <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={userEmail}
            disabled
            className={`${inputClass} bg-gray-50 dark:bg-[#0A162A] cursor-not-allowed`}
            style={inputStyle}
          />
        </div>
      </div>

      <h2 className="text-base font-semibold text-[#0A1B39] dark:text-[#F8FAFC] mb-5">
        Address Information
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 mb-5">
        <div className={rowClass}>
          <label style={labelStyle} className={labelClass}>
            Country  <span className="text-red-500">*</span>
          </label>
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
          <label style={labelStyle} className={labelClass}>
            State  <span className="text-red-500">*</span>
          </label>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 mb-8">
        <div className={rowClass}>
          <label style={labelStyle} className={labelClass}>
            City  <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="hidden xl:block" />
      </div>

      {message && (
        <p
          className={`mb-4 text-sm ${
            message.startsWith("Error")
              ? "text-red-500"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-5 border-t border-[#E5E7EB] dark:border-[#2A3850]">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:w-auto rounded-lg border border-[#98A2B3] dark:border-[#3A4A63] px-5 py-2 text-sm font-medium text-[#344054] dark:text-[#F8FAFC] hover:bg-gray-50 dark:hover:bg-[#18243A] active:scale-95 transition-all duration-150"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isPending}
  className="w-full sm:w-auto rounded-lg bg-[#2E37A4] dark:bg-[#1E3A8A] px-5 py-2 text-sm font-medium text-white dark:text-white hover:bg-[#252d8c] dark:hover:bg-[#3154A3] active:scale-95 transition-all duration-150 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}