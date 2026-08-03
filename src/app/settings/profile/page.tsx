import { Card } from "@/components/ui/card";

export default function ProfileSettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Profile Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your account information and preferences.</p>
      <div className="mt-6">
        <Card label="Account Status" value="Active" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
