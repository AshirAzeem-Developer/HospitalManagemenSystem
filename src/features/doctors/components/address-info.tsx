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
};

const inputClass =
  "w-full rounded-lg border border-[#E7E8EB] bg-white px-3 py-2 text-[14px] font-normal text-[#667085] outline-none placeholder:text-[#98A2B3] focus:border-[#4F46E5] dark:border-gray-700 dark:bg-[#111F33] dark:text-gray-200 dark:placeholder:text-gray-500";

const inputStyle: React.CSSProperties = {
  fontWeight: 400,
  fontSize: "14px",
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
    ...(errors[field] && {
      borderColor: "#F87171",
    }),
  });

  return (
    <div className="flex justify-center bg-white dark:bg-[#0A162A]">
      <div className="w-full max-w-4xl">
        {/* Heading */}
          <h2 className="mb-3 p-2 text-base font-semibold text-[#0A1B39] dark:text-white">
            Address Information
          </h2>

        {/* Country + State */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Country */}
          <div className={columnClass}>
            <label
              style={labelStyle}
              className="text-[#0A1B39] dark:text-white"
            >
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

          {/* State */}
          <div className={columnClass}>
            <label
              style={labelStyle}
              className="text-[#0A1B39] dark:text-white"
            >
              State <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={addressInfo.state}
              onChange={(e) => {
                const value = e.target.value;

                setAddressInfo((prev) => ({
                  ...prev,
                  state: value,
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

        {/* City */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className={columnClass}>
            <label
              style={labelStyle}
              className="text-[#0A1B39] dark:text-white"
            >
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