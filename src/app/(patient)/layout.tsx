import MainLayout from "@/components/ui/MainLayout";
import type { MenuGroup } from "@/components/ui/MainLayout";

const patientMenuGroups: MenuGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/patient", icon: "LayoutDashboard" },
      {
        label: "Appointments",
        href: "/patient/appointments",
        icon: "CalendarDays",
      },
      { label: "Doctors", href: "/patient/doctors", icon: "Stethoscope" },
      {
        label: "Prescriptions",
        href: "/patient/prescriptions",
        icon: "FileText",
      },
      { label: "Invoice", href: "/patient/invoice", icon: "Receipt" },
      {
        label: "Health Tracking",
        href: "/patient/health-tracking",
        icon: "HeartPulse",
        hasArrow: true,
      },
      {
        label: "AI Assistant",
        href: "/patient/ai-assistant",
        icon: "Bot",
        hasArrow: true,
      },
      {
        label: "Settings",
        href: "/patient/settings",
        icon: "Settings",
        hasArrow: true,
      },
    ],
  },
];

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout menuGroups={patientMenuGroups} userInitials="PT">
      {children}
    </MainLayout>
  );
}