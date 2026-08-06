import { createClient } from "@/lib/supabase/server";
import type { Profile } from "./types";

export async function getCurrentUserProfile(): Promise<{
  profile: Profile | null;
  email: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { profile: null, email: "" };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("getCurrentUserProfile error:", error.message);
  }

  return { profile: profile as Profile | null, email: user.email ?? "" };
}