import MainLayout from "@/components/ui/MainLayout";
import type { MenuGroup } from "@/components/ui/MainLayout";
import Image from "next/image";

const adminMenuGroups: MenuGroup[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: "LayoutDashboard",
        subItems: [
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Doctor Dashboard", href: "/doctor" },
          { label: "Patient Dashboard", href: "/patient" },
        ],
      },
    ],
  },
  {
    title: "Clinic",
    items: [
      {
        label: "Doctors",
        href: "/admin/doctors",
        icon: "Stethoscope",
        subItems: [
          { label: "Doctors", href: "/admin/doctors" },
          { label: "Doctor Details", href: "/admin/doctors/details" },
          { label: "Add Doctor", href: "/admin/doctors/add" },
          { label: "Doctor Schedule", href: "/admin/doctors/schedule" },
        ],
      },
      {
        label: "Patients",
        href: "/admin/patients",
        icon: "Users2",
        subItems: [
          { label: "Patients", href: "/admin/patients" },
          { label: "Patient Details", href: "/admin/patients/details" },
          { label: "Create Patient", href: "/admin/patients/create" },
        ],
      },
      { label: "Appointments", href: "/admin/appointments", icon: "CalendarDays" },
      { label: "Billing", href: "/admin/billing", icon: "Briefcase" },
      { label: "Activity Logs", href: "/admin/activity-logs", icon: "Layers" },
      { label: "Settings", href: "/admin/settings", icon: "Settings" },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clinicHeader = (
    <div className="mb-4">
      <Image
        src="/Images/ClinicSelect.png"
        alt="Trustcare Clinic"
        width={244}
        height={56}
        className="w-full h-auto rounded-xl"
        priority
      />
    </div>
  );

  return (
    <MainLayout menuGroups={adminMenuGroups} userInitials="AD" sidebarHeader={clinicHeader}>
      {children}
    </MainLayout>
  );
}