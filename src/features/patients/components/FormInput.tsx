
import type { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  error?: string;
};

export default function FormInput({
  label,
  required = false,
  type = "text",
  placeholder = "",
  error,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="
          h-11
          w-full
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3
          text-sm
          text-slate-900
          placeholder:text-slate-400
          outline-none
          transition
          focus:border-blue-500
          focus:ring-1
          focus:ring-blue-500
          dark:border-gray-700
          dark:bg-gray-900
          dark:text-white
          dark:placeholder:text-gray-500
        "
        {...props}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

