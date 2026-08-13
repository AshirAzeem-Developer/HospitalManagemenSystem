"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Dropdown } from "@/components/ui/select";
import Button from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import {
  FiList,
  FiCalendar,
  FiFilter,
  FiPlus,
  FiChevronDown,
} from "react-icons/fi";

import {
  getPatients,
  getDoctors,
} from "@/features/appointments/appointmentActions/appointmentAction";

export default function AppointmentHeader({
  title = "Appointment",
  currentView = "list",
  newAppointmentUrl = "/admin/appointments/new",
  showNewButton = true,
  onSearch,
  onSortChange,
  onViewChange,
  onFilterApply,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Recent");

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);

  const statuses = [
    { id: "pending", name: "Pending" },
    { id: "confirmed", name: "Confirmed" },
    { id: "completed", name: "Completed" },
    { id: "cancelled", name: "Cancelled" },
  ];

  const initialFilterState = {
    patient: "",
    doctor: "",
    date: "",
    customStart: "",
    customEnd: "",
    status: "",
  };
  const [filterState, setFilterState] = useState(initialFilterState);

  useEffect(() => {
    const fetchDropdownData = async () => {
      const [patientsData, doctorsData] = await Promise.all([
        getPatients(),
        getDoctors(),
      ]);
      if (patientsData) setPatients(patientsData);
      if (doctorsData) setDoctors(doctorsData);
    };
    fetchDropdownData();
  }, []);

  const handleResetField = (field) => {
    const updated =
      field === "date"
        ? { ...filterState, date: "", customStart: "", customEnd: "" }
        : { ...filterState, [field]: "" };
    setFilterState(updated);
    onFilterApply?.(updated);
  };

  const handleClearAll = () => {
    setFilterState(initialFilterState);
    onFilterApply?.(initialFilterState);
  };

  const handleChange = (field, val) => {
    setFilterState((prev) => ({ ...prev, [field]: val }));
    setActiveFilterDropdown(null);
  };

  const dateOptions = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "last_7_days", label: "Last 7 days" },
    { id: "this_month", label: "This month" },
    { id: "last_month", label: "Last month" },
    { id: "this_year", label: "This year" },
    { id: "last_year", label: "Last year" },
    { id: "custom", label: "Custom Range" },
  ];

  const selectFilters = [
    {
      key: "patient",
      label: "Patient",
      items: patients,
      displayKey: "profile.full_name",
    },
    {
      key: "doctor",
      label: "Doctor",
      items: doctors,
      displayKey: "profile.full_name",
    },
    { key: "status", label: "Status", items: statuses, displayKey: "name" },
  ];

  const renderSelectField = (filter) => {
    const { key, label, items, displayKey } = filter;

    if (key === "status") {
      return (
        <div key={`filter-wrap-${key}`}>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-foreground">{label}</label>
            <button
              type="button"
              onClick={() => handleResetField(key)}
              className="cursor-pointer text-sm font-medium text-indigo-600 hover:underline"
            >
              Reset
            </button>
          </div>
          <select
            value={filterState[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="cursor-pointer w-full text-sm border border-border rounded-lg p-2.5 bg-background outline-none focus:border-indigo-500 text-foreground"
          >
            <option value="">Select {label}</option>
            {items &&
              items.map((item) => (
                <option key={`${key}-opt-${item.id}`} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
      );
    }

    let selectedDisplayName = `Select ${label}`;
    const selectedItem = items?.find((i) => (i?.id || i) === filterState[key]);
    if (selectedItem) {
      if (displayKey) {
        const keys = displayKey.split(".");
        selectedDisplayName =
          keys.reduce((acc, curr) => acc && acc[curr], selectedItem) ||
          selectedDisplayName;
      }
    }

    return (
      <div key={`filter-wrap-${key}`}>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-bold text-foreground">{label}</label>
          <button
            type="button"
            onClick={() => handleResetField(key)}
            className="cursor-pointer text-sm font-medium text-indigo-600 hover:underline"
          >
            Reset
          </button>
        </div>

        <div className="relative w-full">
          <button
            type="button"
            onClick={() =>
              setActiveFilterDropdown(activeFilterDropdown === key ? null : key)
            }
            className="cursor-pointer w-full flex justify-between items-center text-sm border border-border rounded-lg p-2.5 bg-background outline-none focus:border-indigo-500 text-foreground"
          >
            <span className="truncate">{selectedDisplayName}</span>
            <FiChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
          </button>

          {activeFilterDropdown === key && (
            <div className="absolute top-full left-0 mt-1 w-full max-h-[200px] overflow-y-auto bg-background border border-border shadow-xl rounded-lg z-[60]">
              <ul className="py-1">
                <li
                  onClick={() => handleChange(key, "")}
                  className="text-sm py-2 px-3 hover:bg-indigo-50 hover:text-slate-900 cursor-pointer text-muted"
                >
                  Select {label}
                </li>
                {items &&
                  items.map((item, index) => {
                    let displayValue = "";
                    if (displayKey) {
                      const keys = displayKey.split(".");
                      displayValue = keys.reduce(
                        (acc, curr) => acc && acc[curr],
                        item,
                      );
                    }
                    const optionValue = item?.id;
                    const isSelected = filterState[key] === optionValue;

                    return (
                      <li
                        key={`${key}-opt-${optionValue || index}`}
                        onClick={() => handleChange(key, optionValue)}
                        className={`text-sm py-2 px-3 hover:bg-indigo-50 hover:text-slate-900 cursor-pointer border-b border-border last:border-0 ${isSelected ? "bg-indigo-50 font-semibold text-indigo-700" : "text-foreground"}`}
                      >
                        {displayValue || `Option ${index + 1}`}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full text-foreground bg-background p-4 shadow-sm space-y-4 rounded-lg border border-border">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="flex bg-hover p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => onViewChange?.("list")}
              className={`cursor-pointer p-1.5 rounded-md transition ${currentView === "list" ? "bg-background shadow-sm text-indigo-700" : "text-muted"}`}
            >
              <FiList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange?.("calendar")}
              className={`cursor-pointer p-1.5 rounded-md transition ${currentView === "calendar" ? "bg-background shadow-sm text-indigo-700" : "text-muted"}`}
            >
              <FiCalendar className="w-4 h-4" />
            </button>
          </div>

          {showNewButton && (
            <Link href={newAppointmentUrl}>
              <Button
                variant="primary"
                text="New Appointment"
                icon={<FiPlus />}
                className="cursor-pointer"
              />
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
        <div className="flex flex-wrap items-center gap-1">
          <SearchBar
            defaultValue={searchTerm}
            onSearch={(val) => {
              setSearchTerm(val);
              onSearch?.(val);
            }}
            placeholder="Search"
          />
        </div>

        <div className="flex items-center gap-3">
          <Dropdown>
            <Dropdown.Trigger className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-medium bg-background border border-border rounded-lg hover:bg-hover text-foreground">
              <FiFilter className="w-4 h-4 text-muted" /> Filters
            </Dropdown.Trigger>

            <Dropdown.Content
              align="right"
              className="w-[360px] p-5 rounded-xl border border-border shadow-2xl bg-background space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-xl font-bold text-foreground">Filter</h3>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="cursor-pointer text-sm font-semibold text-red-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {selectFilters
                .slice(0, 2)
                .map((filter) => renderSelectField(filter))}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-foreground">
                    Date
                  </label>
                  <button
                    type="button"
                    onClick={() => handleResetField("date")}
                    className="cursor-pointer text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <select
                  value={filterState.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="cursor-pointer w-full text-sm border border-border rounded-lg p-2.5 bg-background outline-none focus:border-indigo-500 text-foreground"
                >
                  <option value="">Select Date Range</option>
                  {dateOptions.map((opt, idx) => (
                    <option key={`popup-date-${opt.id}-${idx}`} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {filterState.date === "custom" && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="date"
                      value={filterState.customStart}
                      onChange={(e) =>
                        handleChange("customStart", e.target.value)
                      }
                      className="cursor-pointer w-full text-sm border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 text-foreground bg-background"
                    />
                    <span className="text-muted text-sm">to</span>
                    <input
                      type="date"
                      value={filterState.customEnd}
                      onChange={(e) =>
                        handleChange("customEnd", e.target.value)
                      }
                      className="cursor-pointer w-full text-sm border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 text-foreground bg-background"
                    />
                  </div>
                )}
              </div>

              {selectFilters
                .slice(2)
                .map((filter) => renderSelectField(filter))}

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <div className="cursor-pointer">
                  <Button
                    variant="primary"
                    text="Apply Filter"
                    onClick={() => onFilterApply?.(filterState)}
                  />
                </div>
              </div>
            </Dropdown.Content>
          </Dropdown>

          <Dropdown>
            <Dropdown.Trigger className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground hover:bg-hover">
              <span className="text-muted">Sort By :</span>
              <span className="font-semibold">{sortBy}</span>
            </Dropdown.Trigger>
            <Dropdown.Content align="right">
              {["Recent", "Oldest"].map((s, idx) => (
                <Dropdown.Item
                  className="cursor-pointer"
                  key={`sort-${s}-${idx}`}
                  onSelect={() => {
                    setSortBy(s);
                    onSortChange?.(s);
                  }}
                >
                  {s}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
