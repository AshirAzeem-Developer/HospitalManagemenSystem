import { getCurrentUserProfile } from "@/features/admin/queries";
import ProfileForm from "@/components/settings/ProfileForm";

export default async function ProfileSettingsPage() {
  const { profile, email } = await getCurrentUserProfile();

  return <ProfileForm initialData={profile} userEmail={email} />;
}