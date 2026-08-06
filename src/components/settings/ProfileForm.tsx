"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

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

export default function ProfileForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
  <div className="w-full max-w-6xl">

      <h2 className="text-base font-semibold text-[#0A1B39] mb-3">
        Basic Information
      </h2>

      <div className="border-b border-[#E5E7EB] mb-6" />

    
      <div className="flex items-center gap-6 mb-8">
        <label style={labelStyle}>
          Profile Image <span className="text-red-500">*</span>
        </label>

        <div className="relative h-16 w-16">
          <Image
            src="/Images/admin.png"
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

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className={rowClass}>
          <label style={labelStyle}>
            First Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className={rowClass}>
          <label style={labelStyle}>
            Last Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
        <div className={rowClass}>
          <label style={labelStyle}>
            Email <span className="text-red-500">*</span>
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        
        <div className={rowClass}>
          <label style={labelStyle}>
            Phone Number <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <h2 className="text-base font-semibold text-[#0A1B39] mb-5">
        Address Information
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className={rowClass}>
          <label style={labelStyle}>Address Line 1</label>

          <input
            type="text"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className={rowClass}>
          <label style={labelStyle}>Address Line 2</label>

          <input
            type="text"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>


      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className={rowClass}>
          <label style={labelStyle}>Country</label>

    <CustomSelect
    placeholder="Select"
    options={[
{value:"pk",label:"Pakistan"},
{value:"usa",label:"United States"},
{value:"uae",label:"UAE"},


    ]}
    />
        </div>

        <div className={rowClass}>
          <label style={labelStyle}>State</label>

    <CustomSelect
  placeholder="Select"
  options={[
    { value: "sindh", label: "Sindh" },
    { value: "punjab", label: "Punjab" },
  ]}
/>
      
        </div>
        <div className={rowClass}>
          <label style={labelStyle}>City</label>

      <CustomSelect
  placeholder="Select"
  options={[
    { value: "karachi", label: "Karachi" },
    { value: "lahore", label: "Lahore" },
  ]}
/>
        </div>
        <div />
      </div>
           
      <div className="flex justify-end gap-3 pt-5 border-t border-[#E5E7EB]">
        <button
          type="button"
          className="rounded-lg border border-[#D0D5DD] px-5 py-2 text-sm font-medium text-[#344054] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-[#2E37A4] px-5 py-2 text-sm font-medium text-white hover:bg-[#252d8c] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}