"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const DropdownContext = createContext(null);

function useDropdownContext(component) {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used inside <Dropdown>`);
  }
  return ctx;
}

/**
 * Generic dropdown primitive. Compose it anywhere you need a
 * trigger + floating panel: menus, nav items, sidebars, pagination
 * page-size pickers, row actions, etc.
 *
 * <Dropdown>
 *   <Dropdown.Trigger>Open</Dropdown.Trigger>
 *   <Dropdown.Content align="left">
 *     <Dropdown.Item onSelect={...}>Edit</Dropdown.Item>
 *     <Dropdown.Item onSelect={...} destructive>Delete</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.open]              controlled open state
 * @param {(open: boolean) => void} [props.onOpenChange]
 * @param {boolean} [props.defaultOpen]
 * @param {string} [props.className]
 */
export function Dropdown({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
  className = "",
}) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemsRef = useRef([]);
  const id = useId();

  function setOpen(next) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) setActiveIndex(-1);
  }

  // close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // close on Escape, return focus to trigger
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const ctx = {
    id,
    isOpen,
    setOpen,
    rootRef,
    triggerRef,
    activeIndex,
    setActiveIndex,
    itemsRef,
  };

  return (
    <DropdownContext.Provider value={ctx}>
      <div ref={rootRef} className={`relative inline-block ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

/**
 * Trigger for the dropdown. Renders a plain button by default; pass
 * `asChild` with a single element child (e.g. an icon button, a nav
 * row) to make that element the trigger instead.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.asChild]
 * @param {string} [props.className]
 */
Dropdown.Trigger = function DropdownTrigger({ children, asChild = false, className = "" }) {
  const { id, isOpen, setOpen, triggerRef } = useDropdownContext("Dropdown.Trigger");

  function toggle() {
    setOpen(!isOpen);
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  const sharedProps = {
    ref: triggerRef,
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
    "aria-controls": `${id}-content`,
    onClick: toggle,
    onKeyDown: handleKeyDown,
  };

  if (asChild) {
    return children(sharedProps);
  }

  return (
    <button type="button" className={className} {...sharedProps}>
      {children}
    </button>
  );
};

/**
 * Floating panel shown when the dropdown is open.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {"left"|"right"} [props.align]   which side the panel edge sticks to
 * @param {"bottom"|"top"} [props.side]    which side of the trigger it opens on
 * @param {string} [props.className]
 * @param {number} [props.width]           optional fixed width in px, else matches content
 */
Dropdown.Content = function DropdownContent({
  children,
  align = "left",
  side = "bottom",
  className = "",
  width,
}) {
  const { id, isOpen, itemsRef, activeIndex, setActiveIndex, setOpen, triggerRef } =
    useDropdownContext("Dropdown.Content");
  const listRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.focus();
  }, [isOpen]);

  function moveActive(delta) {
    const items = itemsRef.current.filter(Boolean);
    if (items.length === 0) return;
    setActiveIndex((prev) => {
      let next = prev;
      for (let i = 0; i < items.length; i++) {
        next = (next + delta + items.length) % items.length;
        if (!items[next]?.disabled) break;
      }
      return next;
    });
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveActive(-1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        itemsRef.current[activeIndex]?.select?.();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  if (!isOpen) return null;

  return (
    <div
      ref={listRef}
      id={`${id}-content`}
      role="menu"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      style={width ? { width } : undefined}
      className={`absolute z-50 min-w-[160px] overflow-auto rounded-[6px] border border-[#e7e8eb]
        bg-white py-1 shadow-[0_4px_16px_rgba(10,27,57,0.08)] outline-none
        ${side === "bottom" ? "top-full mt-1" : "bottom-full mb-1"}
        ${align === "right" ? "right-0" : "left-0"}
        ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * A single selectable row inside Dropdown.Content.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {() => void} [props.onSelect]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.destructive]   red text, e.g. "Delete"
 * @param {React.ComponentType} [props.icon]
 */
Dropdown.Item = function DropdownItem({
  children,
  onSelect,
  disabled = false,
  destructive = false,
  icon: Icon,
}) {
  const { itemsRef, activeIndex, setActiveIndex, setOpen, triggerRef } =
    useDropdownContext("Dropdown.Item");
  const indexRef = useRef(-1);

  if (indexRef.current === -1) {
    indexRef.current = itemsRef.current.length;
    itemsRef.current.push({ disabled, select: handleSelect });
  } else {
    itemsRef.current[indexRef.current] = { disabled, select: handleSelect };
  }

  function handleSelect() {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
    triggerRef.current?.focus();
  }

  const isActive = activeIndex === indexRef.current;

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onMouseEnter={() => !disabled && setActiveIndex(indexRef.current)}
      onClick={handleSelect}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors
        ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
        ${isActive ? "bg-[#f5f6f8]" : ""}
        ${destructive ? "text-[#ef1e1e]" : "text-[#0a1b39]"}`}
    >
      {Icon && <Icon size={14} className="shrink-0" aria-hidden="true" />}
      <span className="truncate">{children}</span>
    </button>
  );
};

/**
 * Thin visual divider between groups of items.
 */
Dropdown.Separator = function DropdownSeparator() {
  return <div className="my-1 h-px bg-[#e7e8eb]" />;
};