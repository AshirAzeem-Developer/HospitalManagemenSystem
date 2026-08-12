"use client";

import type { AddressInfo } from "../types";

type Props = {
  addressInfo: AddressInfo;
  setAddressInfo: React.Dispatch<React.SetStateAction<AddressInfo>>;
  errors: Record<string, string[]>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
};

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

const columnClass = "flex flex-col gap-2";

export default function AddressInformation({
  addressInfo,
  setAddressInfo,
  errors,
  setErrors,
}: Props) {
  const getInputStyle = (field: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: errors[field] ? "#F87171" : "#E7E8EB",
  });
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="mb-3 p-2 text-base font-semibold text-[#0A1B39]">
          Address Information
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className={columnClass}>
            <label style={labelStyle}>
              Country <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={addressInfo.country}
              onChange={(e) => {
                const value = e.target.value;

                setAddressInfo((prev) => ({
                  ...prev,
                  country: value,
                }));
                setErrors((prev) => {
                  if (!prev.country) return prev;
                  const next = { ...prev };
                  delete next.country;
                  return next;
                });
              }}
              placeholder="Enter Country"
              className={inputClass}
              style={getInputStyle("country")}
            />
            {errors.country && (
              <p className="text-xs text-red-500">{errors.country[0]}</p>
            )}
          </div>

          <div className={columnClass}>
            <label style={labelStyle}>
              State <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={addressInfo.state}
              onChange={(e) => {
                const value = e.target.value;
                setAddressInfo((prev) => ({
                  ...prev,
                  state: e.target.value,
                }));
                setErrors((prev) => {
                  if (!prev.state) return prev;

                  const next = { ...prev };
                  delete next.state;
                  return next;
                });
              }}
              placeholder="Enter State"
              className={inputClass}
              style={getInputStyle("state")}
            />
            {errors.state && (
              <p className="text-xs text-red-500">{errors.state[0]}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className={columnClass}>
            <label style={labelStyle}>
              City <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={addressInfo.city}
              onChange={(e) => {
                const value = e.target.value;

                setAddressInfo((prev) => ({
                  ...prev,
                  city: value,
                }));

                setErrors((prev) => {
                  if (!prev.city) return prev;

                  const next = { ...prev };
                  delete next.city;
                  return next;
                });
              }}
              placeholder="Enter City"
              className={inputClass}
              style={getInputStyle("city")}
            />

            {errors.city && (
              <p className="text-xs text-red-500">{errors.city[0]}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
