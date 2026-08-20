"use client";

import {
  Scale,
  Ruler,
  Activity,
  Wind,
  Thermometer,
  type LucideIcon,
} from "lucide-react";

type VitalItem = {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  icon: LucideIcon;
};

type VitalsCardProps = {
  weight?: string | number | null;
  height?: string | number | null;
  pulse?: string | number | null;
  spo2?: string | number | null;
  temperature?: string | number | null;
};

export default function VitalsCard({
  weight,
  height,
  pulse,
  spo2,
  temperature,
}: VitalsCardProps) {
  const vitals: VitalItem[] = [
    { label: "Weight", value: weight, unit: "Kg", icon: Scale },
    { label: "Height", value: height, unit: "cm", icon: Ruler },
    { label: "Pulse", value: pulse, unit: "%", icon: Activity },
    { label: "SPO2", value: spo2, unit: "%", icon: Wind },
    { label: "Temperature", value: temperature, unit: "C", icon: Thermometer },
  ];

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
        <h2 className="text-base font-bold text-slate-900">Vitals</h2>
      </div>

      {/* Vitals Grid */}
      <div className="p-4 sm:p-5">
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-5">
          {vitals.map(({ label, value, unit, icon: Icon }) => (
            <div
              key={label}
              className="flex w-full items-center gap-3 rounded-lg border border-slate-100 p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2E37A4] text-white">
                <Icon size={18} />
              </span>

              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500">{label}</p>
                <p className="truncate text-base font-bold text-slate-900">
                  {value ?? "—"}
                  {value != null && unit ? (
                    <span className="ml-1 text-xs font-normal text-slate-500">
                      {unit}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}