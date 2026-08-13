import React from "react";
import clsx from "clsx";

type ButtonVariant =
  | "primary"
  | "ghost"
  | "apply"
  | "danger"
  | "status-warning"
  | "status-primary"
  | "status-success"
  | "status-danger";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  text: string;
  icon?: React.ReactNode;
}

const Button = ({
  variant = "primary",
  text,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-1 rounded-md px-[10px] py-[6px] text-sm font-medium transition-colors duration-200",
        {
          "bg-[#2E37A4] text-white hover:bg-[#27308f]":
            variant === "primary",

          "bg-white text-black border border-gray-300 hover:bg-gray-100":
            variant === "ghost",

          "bg-[#030303] text-white hover:bg-black":
            variant === "apply",

          "bg-[#EF1E1E] text-white hover:bg-red-700":
            variant === "danger",

          "bg-[#FEFBF5] text-[#E2B93B] border border-[#E2B93B]":
            variant === "status-warning",

          "bg-[#F4F9FE] text-[#2F80ED] border border-[#2F80ED]":
            variant === "status-primary",

          "bg-[#F4FBF7] text-[#27AE60] border border-[#27AE60]":
            variant === "status-success",

          "bg-[#FEF4F4] text-[#EF1E1E] border border-[#EF1E1E]":
            variant === "status-danger",

          "opacity-50 cursor-not-allowed": disabled,
        },
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default Button;