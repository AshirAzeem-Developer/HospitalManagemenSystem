"use client";

import { useState, useMemo, useEffect } from "react";
import PaginationControls from "./PaginationControls";

interface FilterState {
  date?: string;
  customStart?: string;
  customEnd?: string;
  status?: string;
  patient?: string;
  doctor?: string;
}

interface DateRange {
  start: Date;
  end: Date;
}

export interface Appointment {
  id: string | number;
  date: string;
  time?: string;
  status?: string;
  patientId?: string | number;
  doctorId?: string | number;
  patientName?: string;
  doctorName?: string;
  patient?: {
    id?: string;
    _id?: string;
    name?: string;
    profile?: {
      full_name?: string;
    };
  };
  doctor?: {
    id?: string;
    _id?: string;
    name?: string;
    profile?: {
      full_name?: string;
    };
  };
}

type FilterSortLogic<T> = (
  data: T[],
  searchTerm: string,
  activeFilters: FilterState,
  sortOrder: string,
) => T[];

interface DataContainerProps<T extends { id: string | number }> {
  initialData?: T[];
  HeaderComponent?: React.ComponentType<any>;
  headerProps?: Record<string, unknown>;
  ListComponent?: React.ComponentType<any>;
  listComponentProps?: Record<string, unknown>;
  filterSortLogic?: FilterSortLogic<T>;
  onEditAction?: (id: T["id"], updatedData: T) => Promise<any>;
  onDeleteAction?: (id: T["id"]) => Promise<any>;
  listPropName?: string;
}

export const appointmentFilterLogic = <T extends Appointment>(
  data: T[],
  searchTerm: string,
  activeFilters: FilterState,
  sortOrder: string,
): T[] => {
  let dateRange: DateRange | null = null;

  if (activeFilters?.date) {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (activeFilters.date) {
      case "today":
        start = new Date(today);
        end = new Date(today);
        break;

      case "yesterday":
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        end = new Date(start);
        break;

      case "last_7_days":
        end = new Date(today);
        start = new Date(today);
        start.setDate(start.getDate() - 6);
        break;

      case "this_month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "last_month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      case "this_year":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;

      case "last_year":
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;

      case "custom":
        if (
          typeof activeFilters.customStart === "string" &&
          typeof activeFilters.customEnd === "string"
        ) {
          start = new Date(activeFilters.customStart);
          end = new Date(activeFilters.customEnd);
        }
        break;
    }

    if (start && end) {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      dateRange = {
        start,
        end,
      };
    }
  }

  const filteredData = (data || []).filter((app) => {
    const pName = (
      app.patientName ||
      app.patient?.profile?.full_name ||
      app.patient?.name ||
      ""
    ).toLowerCase();

    const dName = (
      app.doctorName ||
      app.doctor?.profile?.full_name ||
      app.doctor?.name ||
      ""
    ).toLowerCase();

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        pName.includes(term) ||
        dName.includes(term) ||
        (app.status || "").toLowerCase().includes(term) ||
        (app.date || "").toLowerCase().includes(term);

      if (!matchesSearch) {
        return false;
      }
    }

    // Status
    if (activeFilters?.status) {
      const itemStatus = app.status
        ? String(app.status).trim().toLowerCase()
        : "";

      const filterStatus = String(activeFilters.status).trim().toLowerCase();

      if (itemStatus !== filterStatus) {
        return false;
      }
    }

    // Patient
    if (activeFilters?.patient) {
      const pId = String(
        app.patientId ||
          app.patient?._id ||
          app.patient?.id ||
          app.patient ||
          "",
      ).toLowerCase();

      const filterP = String(activeFilters.patient).toLowerCase();

      if (pId !== filterP && !pName.includes(filterP)) {
        return false;
      }
    }

    // Doctor
    if (activeFilters?.doctor) {
      const dId = String(
        app.doctorId || app.doctor?._id || app.doctor?.id || app.doctor || "",
      ).toLowerCase();

      const filterD = String(activeFilters.doctor).toLowerCase();

      if (dId !== filterD && !dName.includes(filterD)) {
        return false;
      }
    }

    // Date
    if (dateRange && app.date) {
      const appDate = new Date(app.date);

      if (!isNaN(appDate.getTime())) {
        if (appDate < dateRange.start || appDate > dateRange.end) {
          return false;
        }
      }
    }

    return true;
  });

  return filteredData.sort((a, b) => {
    const timeA = a.time || "";
    const timeB = b.time || "";

    const dateA = new Date(`${a.date} ${timeA}`).getTime() || 0;

    const dateB = new Date(`${b.date} ${timeB}`).getTime() || 0;

    return sortOrder === "Oldest" ? dateA - dateB : dateB - dateA;
  });
};

export default function DataContainer<T extends { id: string | number }>({
  initialData = [],
  HeaderComponent,
  headerProps = {},
  ListComponent,
  listComponentProps = {},
  filterSortLogic,
  onEditAction,
  onDeleteAction,
  listPropName = "data",
}: DataContainerProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Recent");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (Array.isArray(initialData)) {
      setData(initialData);
    }
  }, [initialData]);

  const handleEdit = async (updatedData: T) => {
    setData((prev) =>
      prev.map((item) => (item.id === updatedData.id ? updatedData : item)),
    );

    if (onEditAction) {
      const result = await onEditAction(updatedData.id, updatedData);

      if (result?.error) {
        alert("Failed to update in database.");
      }
    }
  };

  const handleDelete = async (id: T["id"]) => {
    setData((prev) => prev.filter((item) => item.id !== id));

    if (onDeleteAction) {
      const result = await onDeleteAction(id);

      if (result?.error) {
        alert("Failed to delete from database.");
      }
    }
  };

  const filteredData = useMemo(() => {
    if (!filterSortLogic) {
      return data;
    }

    return filterSortLogic(data, searchTerm, activeFilters, sortOrder);
  }, [data, searchTerm, activeFilters, sortOrder, filterSortLogic]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const startIndex = (currentPage - 1) * limit;

  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterApply = (filters: FilterState) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
    setCurrentPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const listProps = {
    [listPropName]: paginatedData,
    onEdit: handleEdit,
    onDelete: handleDelete,
    ...listComponentProps,
  };

  return (
    <div className="space-y-6">
      {HeaderComponent && (
        <HeaderComponent
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          onFilterApply={handleFilterApply}
          onDateChange={(dateObj: {
            type: string;
            start?: string;
            end?: string;
          }) =>
            handleFilterApply({
              ...activeFilters,
              date: dateObj.type,
              customStart: dateObj.start,
              customEnd: dateObj.end,
            })
          }
          {...headerProps}
        />
      )}

      <div className="space-y-4 rounded-lg border border-border bg-background p-4 text-foreground shadow-sm">
        {ListComponent && <ListComponent {...listProps} />}

        {totalItems > 0 && (
          <div className="border-t border-border pt-4">
            <PaginationControls
              page={currentPage}
              totalPages={totalPages}
              onPageChange={(page: number) => setCurrentPage(page)}
              limit={limit}
              onLimitChange={handleLimitChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
