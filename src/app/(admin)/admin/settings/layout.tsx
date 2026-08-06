import SettingsPanel from "@/components/settings/SettingsPanel";

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsPanel baseHref="/admin/settings">{children}</SettingsPanel>
  );
}