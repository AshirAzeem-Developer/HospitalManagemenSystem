import MainLayout from "@/components/ui/MainLayout";
import type { MenuGroup } from "@/components/ui/MainLayout";

const doctorMenuGroups: MenuGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/doctor", icon: "LayoutDashboard" },
      {
        label: "Appointments",
        href: "/doctor/appointments",
        icon: "CalendarDays",
        hasArrow: true,
      },
      { label: "My Schedule", href: "/doctor/schedule", icon: "Clock3" },
      {
        label: "Prescriptions",
        href: "/doctor/prescriptions",
        icon: "FileText",
      },
      {
        label: "Settings",
        href: "/doctor/settings",
        icon: "Settings",
        hasArrow: true,
      },
    ],
  },
];

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout menuGroups={doctorMenuGroups} userInitials="DR">
      {children}
    </MainLayout>
  );
}