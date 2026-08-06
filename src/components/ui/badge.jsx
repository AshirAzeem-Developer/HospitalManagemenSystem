import React from "react"

const colors = {
  green: {
    solid: "bg-emerald-600 text-white",
    light: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-600",
  },
  red: {
    solid: "bg-red-600 text-white",
    light: "bg-red-100 text-red-600",
    dot: "bg-red-600",
  },
  yellow: {
    solid: "bg-amber-500 text-white",
    light: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
  },
  blue: {
    solid: "bg-blue-600 text-white",
    light: "bg-blue-100 text-blue-600",
    dot: "bg-blue-600",
  },

  "green-blue": {
    light: "bg-emerald-100 text-blue-600",
    solid: "",
    dot: "",
  },
  "light-blue": {
    light: "bg-sky-100 text-sky-600",
    dot: "bg-sky-500",
    solid: "",
  },
  purple: {
    dot: "bg-purple-600",
    solid: "",
    light: "",
  },
  white: {
    light: "bg-white text-sky-500 border border-slate-200",
    solid: "",
    dot: "",
  },
}

export function Badge({ children, color = "blue", type = "light" }) {
  if (type === "dot") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-light text-slate-700">
        <span className={`h-2 w-2 rounded-full ${colors[color]?.dot || ""}`} />
        {children}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        colors[color]?.[type] || ""
      }`}
    >
      {children}
    </span>
  )
}