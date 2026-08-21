"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, RefreshCw, Upload } from "lucide-react";
import type { ContactInfo } from "../types";
type Props = {
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
  errors: Record<string, string[]>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  isEdit?: boolean;
  avatarUrl?: string | null;
};
const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "21px",
  letterSpacing: "0%",
};

const inputClass =
  "w-full rounded-lg border border-[#E7E8EB] bg-white px-3 py-2 text-[14px] font-normal text-[#667085] outline-none placeholder:text-[#98A2B3] focus:border-[#4F46E5] dark:border-gray-700 dark:bg-[#111F33] dark:text-gray-200 dark:placeholder:text-gray-500";

const inputStyle: React.CSSProperties = {
  border: "1px solid #E7E8EB",
  fontWeight: 400,
  fontSize: "14px",
};

const columnClass = "flex flex-col gap-2";
export default function ContactInformation({
  contactInfo,
  setContactInfo,
  errors,
  setErrors,
  isEdit = false,
  avatarUrl,
}: Props) {
  // const [fullName, setFullName] = useState("");
  // const [email, setEmail] = useState("");
  // const [specialization, setSpecialization] = useState("");
  // const [qualification, setQualification] = useState("");
  // const [phone, setPhone] = useState("");
  // const [gender, setGender] = useState("");
  // const [status, setStatus] = useState("");
  // const [fee, setFee] = useState("");
  // const [bio, setBio] = useState("");
  // const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl ?? null);
  const [showPassword, setShowPassword] = useState(false);
  const specializations = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
  ];
  const qualifications = [
    "MBBS",
    "BDS",
    "MD",
    "MS",
    "DM",
    "MCh",
    "DNB",
    "FCPS",
    "MRCP",
    "FRCS",
    "PhD",
  ];
  const genders = ["male", "female"];
  const statuses = ["available", "on_leave"];
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setContactInfo((prev) => ({
      ...prev,
      profileImage: file,
    }));

    setPreview(URL.createObjectURL(file));

    // Clear profile image validation error
    setErrors((prev) => {
      if (!prev.profileImage) return prev;

      const next = { ...prev };
      delete next.profileImage;
      return next;
    });
  };
  const generatePassword = () => {
    const password = `Doc@${Math.random()
      .toString(36)
      .slice(2, 8)}${Math.floor(Math.random() * 10)}`;

    setContactInfo((prev) => ({
      ...prev,
      password,
    }));

    setShowPassword(true);

    // Clear password validation error
    setErrors((prev) => {
      if (!prev.password) return prev;

      const next = { ...prev };
      delete next.password;
      return next;
    });
  };

  // const getInputClass = (field: string) =>
  //   `${inputClass} ${
  //     errors[field]
  //       ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-100"
  //       : ""
  //   }`;
  const getInputStyle = (field: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: errors[field] ? "#F87171" : undefined,
  });
  return (
    <div>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <h2 className="mb-3 p-2 text-base font-semibold text-[#0A1B39] dark:text-white">
            Contact Information
          </h2>

          <div className="flex items-center gap-6 mb-8">
            <label
              style={labelStyle}
              className="text-[#0A1B39] dark:text-white"
            >
              Profile Image <span className="text-red-500">*</span>
            </label>

            <div className="relative h-20 w-20">
              <label className="group relative cursor-pointer">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-slate-300 bg-slate-50 dark:border-gray-700 dark:bg-[#111F33]">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Doctor"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-gray-500">
                      No Image
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 -right-2 rounded-full bg-[#2E37A4] p-2 text-white shadow">
                  <Upload size={12} />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {errors.profileImage && (
              <p className="text-xs text-red-500">{errors.profileImage[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 mb-5 sm:grid-cols-2">
            {" "}
            <div className={columnClass}>
              <label
                style={labelStyle}
                className="text-[#0A1B39] dark:text-white"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  type="text"
                  value={contactInfo.fullName}
                  onChange={(e) => {
                    const value = e.target.value;

                    setContactInfo((prev) => ({
                      ...prev,
                      fullName: value,
                    }));

                    setErrors((prev) => {
                      if (!prev.fullName) return prev;

                      const next = { ...prev };
                      delete next.fullName;
                      return next;
                    });
                  }}
                  className={inputClass}
                  style={getInputStyle("fullName")}
                />

                {errors.fullName && (
                  <p className="text-xs text-red-500">{errors.fullName[0]}</p>
                )}
              </div>
            </div>
            <div className={columnClass}>
              <label
                style={labelStyle}
                className="text-[#0A1B39] dark:text-white"
              >
                Email <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                value={contactInfo.email}
                readOnly={isEdit}
                onChange={(e) => {
                  if (isEdit) return;

                  const value = e.target.value;

                  setContactInfo((prev) => ({
                    ...prev,
                    email: value,
                  }));

                  setErrors((prev) => {
                    if (!prev.email) return prev;

                    const next = { ...prev };
                    delete next.email;
                    return next;
                  });
                }}
                className={`${inputClass} ${
                  isEdit
                    ? "cursor-not-allowed bg-[#F5F6F8] text-[#667085] dark:bg-[#0D1A2D] dark:text-gray-400"
                    : "bg-white dark:bg-[#111F33]"
                }`}
                style={getInputStyle("email")}
              />

              {errors.email && (
                <p className="text-xs text-red-500">{errors.email[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
            {/* Password */}
            <div className={columnClass}>
              <label
                style={labelStyle}
                className="text-[#0A1B39] dark:text-white"
              >
                Password {!isEdit && <span className="text-red-500">*</span>}
              </label>
              {isEdit && (
                <p className="text-xs text-[#98A2B3] dark:text-gray-500">
                  Leave blank to keep the current password.
                </p>
              )}

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={contactInfo.password}
                    onChange={(e) => {
                      const value = e.target.value;

                      setContactInfo((prev) => ({
                        ...prev,
                        password: value,
                      }));

                      setErrors((prev) => {
                        if (!prev.password) return prev;

                        const next = { ...prev };
                        delete next.password;
                        return next;
                      });
                    }}
                    className={`${inputClass} pr-10`}
                    style={getInputStyle("password")}
                    placeholder={
                      isEdit
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={generatePassword}
                  className="flex items-center gap-1 rounded-lg bg-[#2E37A4] px-3 text-sm text-white"
                >
                  <RefreshCw size={15} />
                  Generate
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password[0]}
                </p>
              )}
            </div>
            {/* Phone */}
            <div className={columnClass}>
              <label
                style={labelStyle}
                className="text-[#0A1B39] dark:text-white"
              >
                Phone No <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={contactInfo.phone}
                onChange={(e) => {
                  const value = e.target.value;

                  setContactInfo((prev) => ({
                    ...prev,
                    phone: value,
                  }));

                  setErrors((prev) => {
                    if (!prev.phone) return prev;

                    const next = { ...prev };
                    delete next.phone;
                    return next;
                  });
                }}
                className={inputClass}
                style={getInputStyle("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
            <div className={columnClass}>
              <label
                style={labelStyle}
                className="text-[#0A1B39] dark:text-white"
              >
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={contactInfo.gender}
                onChange={(e) => {
                  const value = e.target.value;

                  setContactInfo((prev) => ({
                    ...prev,
                    gender: value,
                  }));

                  setErrors((prev) => {
                    if (!prev.gender) return prev;

                    const next = { ...prev };
                    delete next.gender;
                    return next;
                  });
                }}
                className={inputClass}
                style={getInputStyle("gender")}
              >
                <option value="">Select Gender</option>

                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender[0]}</p>
              )}
            </div>
            <div className={columnClass}>
              <label
                style={labelStyle}
                className="text-[#0A1B39] dark:text-white"
              >
                Specialization <span className="text-red-500">*</span>
              </label>
              <select
                value={contactInfo.specialization}
                onChange={(e) => {
                  const value = e.target.value;

                  setContactInfo((prev) => ({
                    ...prev,
                    specialization: value,
                  }));

                  setErrors((prev) => {
                    if (!prev.specialization) return prev;

                    const next = { ...prev };
                    delete next.specialization;
                    return next;
                  });
                }}
                className={inputClass}
                style={getInputStyle("specialization")}
              >
                <option value="">Select Specialization</option>

                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className="text-xs text-red-500">
                  {errors.specialization[0]}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
            <div className={columnClass}>
              <label
                style={labelStyle}
                className="text-[#0A1B39] dark:text-white"
              >
                Qualification <span className="text-red-500">*</span>
              </label>
              <select
                value={contactInfo.qualification}
                onChange={(e) => {
                  const value = e.target.value;

                  setContactInfo((prev) => ({
                    ...prev,
                    qualification: value,
                  }));

                  setErrors((prev) => {
                    if (!prev.qualification) return prev;

                    const next = { ...prev };
                    delete next.qualification;
                    return next;
                  });
                }}
                className={inputClass}
                style={getInputStyle("qualification")}
              >
                <option value="">Select Qualification</option>

                {qualifications.map((qua) => (
                  <option key={qua} value={qua}>
                    {qua}
                  </option>
                ))}
              </select>
              {errors.qualification && (
                <p className="text-xs text-red-500">
                  {errors.qualification[0]}
                </p>
              )}
            </div>
            <div className={columnClass}>
              <label
                style={labelStyle}
                className="text-[#0A1B39] dark:text-white"
              >
                Consultation Fee Rs/- <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={contactInfo.consultationFee}
                onChange={(e) => {
                  const value = e.target.value;
                  setContactInfo((prev) => ({
                    ...prev,
                    consultationFee: value === "" ? "" : Number(value),
                  }));
                  setErrors((prev) => {
                    if (!prev.consultationFee) return prev;

                    const next = { ...prev };
                    delete next.consultationFee;
                    return next;
                  });
                }}
                className={`${inputClass} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                style={getInputStyle("consultationFee")}
              />
              {errors.consultationFee && (
                <p className="text-xs text-red-500">
                  {errors.consultationFee[0]}
                </p>
              )}
            </div>
          </div>
          {isEdit && (
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
              <div className={columnClass}>
                <label
                  style={labelStyle}
                  className="text-[#0A1B39] dark:text-white"
                >
                  Status
                </label>

                <select
                  value={contactInfo.status}
                  onChange={(e) => {
                    const value = e.target.value;

                    setContactInfo((prev) => ({
                      ...prev,
                      status: value,
                    }));

                    setErrors((prev) => {
                      if (!prev.status) return prev;

                      const next = { ...prev };
                      delete next.status;
                      return next;
                    });
                  }}
                  className={inputClass}
                  style={getInputStyle("status")}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "available" ? "Available" : "On Leave"}
                    </option>
                  ))}
                </select>

                {errors.status && (
                  <p className="text-xs text-red-500">{errors.status[0]}</p>
                )}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className={columnClass}>
              <label
                style={labelStyle}
                className="text-[#0A1B39] dark:text-white"
              >
                Bio <span className="text-red-500">*</span>
              </label>

              <div className="w-full">
                <textarea
                  value={contactInfo.bio}
                  onChange={(e) => {
                    const value = e.target.value;

                    setContactInfo((prev) => ({
                      ...prev,
                      bio: value,
                    }));

                    setErrors((prev) => {
                      if (!prev.bio) return prev;

                      const next = { ...prev };
                      delete next.bio;
                      return next;
                    });
                  }}
                  className={inputClass}
                  style={getInputStyle("bio")}
                />

                {errors.bio && (
                  <p className="text-xs text-red-500">{errors.bio[0]}</p>
                )}
                <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                  {contactInfo.bio.length}/500
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
