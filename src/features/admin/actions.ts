"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { profileUpdateSchema } from "./schema";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const rawData = {
    full_name: formData.get("fullName") as string,
    country: formData.get("country") as string,
    state: formData.get("state") as string,
    city: formData.get("city") as string,
    gender: formData.get("gender") as string,
  };

  const parsed = profileUpdateSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/settings/profile");
  return { success: true };
}