export default function FormInput({
  label,
  required = false,
  type = "text",
  placeholder = "",
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
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
        "
        {...props}
      />
    </div>
  );
}