interface InputProps {
  id?: string;
  name?: string;
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  const {
    id,
    name,
    label,
    placeholder,
    type = "text",
    value,
    required,
    disabled,
    error,
    className = "",
    onChange,
  } = props;

  return (
    <div className="flex w-full flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[#1E293B]"
      >
        {label}
        {required && (
          <span className="ml-1 text-[#EF4444]">*</span>
        )}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className={`
          w-full
          h-9
          rounded-md
          border
          border-gray-200
          bg-white
          px-4
          text-sm
          text-gray-700
          placeholder:text-gray-400
          outline-none
          transition-colors
          focus:border-blue-500
          disabled:bg-gray-100
          disabled:cursor-not-allowed
          ${className}
          `}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}