"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function CustomSelect({
  options,
  placeholder = "Select",
  value,
  onChange,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] =
    useState<SelectOption | null>(null);

  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) {
      setSelectedOption(null);
      return;
    }

    const option = options.find((item) => item.value === value);

    if (option) {
      setSelectedOption(option);
    }
  }, [value, options]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    setIsOpen(false);

    if (onChange) {
      onChange(option.value);
    }
  };
    return (
    <div className="relative w-full" ref={selectRef}>
      {/* Select Box */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-[14px] transition-colors ${
          isOpen
            ? "border-[#2E37A4]"
            : "border-[#E7E8EB] hover:border-[#2E37A4]"
        }`}
      >
        <span
          className={
            selectedOption ? "text-[#667085]" : "text-[#98A2B3]"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-[#667085] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-[#E7E8EB] bg-white shadow-lg">
          {options.map((option) => {
            const isSelected =
              selectedOption?.value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center px-3 py-2 text-left text-[14px] transition-colors
                ${
                  isSelected
                    ? "bg-[#2E37A4] text-white"
                    : "text-[#667085] hover:bg-[#2E37A4] hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}