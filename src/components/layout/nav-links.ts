import type { MenuGroup, MenuItem, SubMenuItem } from "./types";
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
        icon: "Clock3",
      },

      {
        label: "Book Appointment",
        href: "/admin/appointments/new",
        icon: "CalendarDays",
      },

      {
        label: "Appointment Requests",
        href: "/admin/appointments/requests",
        icon: "CalendarClock",
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
        href: "/settings/profile",
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
        label: "Prescriptions",
        href: "/doctor/prescriptions",
        icon: "FileText",
      },
      {
        label: "Settings",
        href: "/settings/profile",
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
        label: "Prescriptions",
        href: "/patient/prescriptions",
        icon: "FileText",
      },
      {
        label: "My Billing",
        href: "/patient/billing",
        icon: "Receipt",
      },

      {
        label: "Settings",
        href: "/settings/profile",
        icon: "Settings",
      },
    ],
  },
];
