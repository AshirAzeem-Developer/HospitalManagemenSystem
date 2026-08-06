import type { MenuGroup, MenuItem, SubMenuItem } from "@/components/ui/MainLayout";
export type { MenuGroup, MenuItem, SubMenuItem };

export const adminLinks: MenuGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: "LayoutDashboard",
      },

      {
        label: "Doctors",
        href: "/admin/doctors",
        icon: "Stethoscope",
      },

      {
        label: "Patients",
        href: "/admin/patients",
        icon: "Users",
      },

      {
        label: "Appointments",
        href: "/admin/appointments",
        icon: "CalendarDays",
      },

      {
        label: "Billing",
        href: "/admin/billing",
        icon: "Receipt",
      },

      {
        label: "Activity Log",
        href: "/admin/activity-log",
        icon: "ClipboardList",
      },

      {
        label: "Settings",
        href: "/admin/settings/profile",
        icon: "Settings",
      },
    ],
  },
];

export const doctorLinks: MenuGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/doctor",
        icon: "LayoutDashboard",
      },

      {
        label: "My Appointments",
        href: "/doctor/appointments",
        icon: "CalendarDays",
      },

      {
        label: "My Patients",
        href: "/doctor/patients",
        icon: "Users",
      },

      {
        label: "Settings",
        href: "/doctor/settings/profile",
        icon: "Settings",
      },
    ],
  },
];

export const patientLinks: MenuGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/patient",
        icon: "LayoutDashboard",
      },

      {
        label: "Book Appointment",
        href: "/patient/appointments/book",
        icon: "CalendarDays",
      },

      {
        label: "My Appointments",
        href: "/patient/appointments",
        icon: "Clock3",
      },

      {
        label: "My Billing",
        href: "/patient/billing",
        icon: "Receipt",
      },

      {
        label: "Settings",
        href: "/patient/settings/profile",
        icon: "Settings",
      },
    ],
  },
];