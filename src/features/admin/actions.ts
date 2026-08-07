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

  revalidatePath("/settings/profile");
  return { success: true };
}

export async function uploadAvatarAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("avatar") as File;

  if (!file || file.size === 0) {
    return { error: "No file selected" };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Please upload an image file" };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { error: "Image must be under 2MB" };
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      upsert: true,
      cacheControl: "3600",
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: signedData, error: signError } = await supabase.storage
    .from("images")
    .createSignedUrl(filePath, 157680000);

  if (signError || !signedData) {
    return { error: signError?.message || "Failed to generate URL" };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: signedData.signedUrl })
    .eq("id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/settings/profile");
  return { success: true, url: signedData.signedUrl };
}