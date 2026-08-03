export type NavLink = { label: string; href: string };

export const adminLinks: NavLink[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Doctors", href: "/admin/doctors" },
  { label: "Patients", href: "/admin/patients" },
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Billing", href: "/admin/billing" },
  { label: "Activity Log", href: "/admin/activity-log" },
  { label: "Settings", href: "/settings/profile" },
];

export const doctorLinks: NavLink[] = [
  { label: "Dashboard", href: "/doctor" },
  { label: "My Appointments", href: "/doctor/appointments" },
  { label: "My Patients", href: "/doctor/patients" },
  { label: "Settings", href: "/settings/profile" },
];

export const patientLinks: NavLink[] = [
  { label: "Dashboard", href: "/patient" },
  { label: "Book Appointment", href: "/patient/appointments/book" },
  { label: "My Appointments", href: "/patient/appointments" },
  { label: "My Billing", href: "/patient/billing" },
  { label: "Settings", href: "/settings/profile" },
];
