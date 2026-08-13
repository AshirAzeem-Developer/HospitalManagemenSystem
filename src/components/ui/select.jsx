"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const DropdownContext = createContext(null);

export function Dropdown({ children }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={rootRef} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

Dropdown.Trigger = function DropdownTrigger({ children, className = "" }) {
  const { open, setOpen } = useContext(DropdownContext);
  return (
    <button type="button" className={className} onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
};

Dropdown.Content = function DropdownContent({ children, align = "left", className = "" }) {
  const { open } = useContext(DropdownContext);
  if (!open) return null;

  return (
    <div
      className={`absolute top-full z-50 mt-1 min-w-[160px] rounded-[6px] border border-border
        bg-background py-1 shadow-[0_4px_16px_rgba(10,27,57,0.08)]
        ${align === "right" ? "right-0" : "left-0"}
        ${className}`}
    >
      {children}
    </div>
  );
};

Dropdown.Item = function DropdownItem({ children, onSelect, destructive = false }) {
  const { setOpen } = useContext(DropdownContext);
  return (
    <button
      type="button"
      onClick={() => {
        onSelect?.();
        setOpen(false);
      }}
      className={`block w-full px-3 py-2 text-left text-sm hover:bg-hover
        ${destructive ? "text-[#ef1e1e]" : "text-foreground"}`}
    >
      {children}
    </button>
  );
};

Dropdown.Separator = function DropdownSeparator() {
  return <div className="my-1 h-px bg-border" />;
};