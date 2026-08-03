"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "./schema";

export async function loginAction(
  values: LoginInput,
): Promise<{ error?: string } | void> {
  console.log("[loginAction] Received login values for email:", values.email);

  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    console.warn("[loginAction] Validation failed:", parsed.error.issues[0].message);
    return { error: parsed.error.issues[0].message };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error || !data.user) {
      const errMsg = error?.message || (error ? String(error) : "Invalid email or password");
      console.error("[loginAction] signInWithPassword failed:", {
        message: error?.message,
        status: error?.status,
        name: error?.name,
        errorRaw: JSON.stringify(error),
      });
      return { error: errMsg };
    }

    console.log("[loginAction] User signed in successfully. User ID:", data.user.id);

    // Attempt to fetch profile with maybeSingle
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      console.warn("[loginAction] Error querying profiles table:", profileError.message);
    }

    const role = profile?.role || data.user.user_metadata?.role || "patient";
    console.log("[loginAction] Determined role:", role);

    // Upsert profile record to ensure database consistency if missing
    if (!profile) {
      console.log("[loginAction] Profile missing in DB. Upserting profile for user:", data.user.id);
      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || "",
        role: role,
      });
      if (upsertError) {
        console.error("[loginAction] Upsert profile error:", upsertError.message);
      }
    }

    console.log("[loginAction] Redirecting to dashboard:", `/${role}`);
    redirect(`/${role}`);
  } catch (err: any) {
    // Next.js redirect throws a special error which must be rethrown
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("[loginAction] Unhandled exception:", err);
    return { error: err?.message || String(err) || "An unexpected error occurred during login." };
  }
}

export async function registerAction(
  values: RegisterInput,
): Promise<{ error?: string } | void> {
  console.log("[registerAction] Registration requested for email:", values.email, "Full name:", values.fullName);
  console.log("[registerAction] Supabase URL configured:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("[registerAction] Supabase Key present?", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    console.warn("[registerAction] Input validation error:", parsed.error.issues[0].message);
    return { error: parsed.error.issues[0].message };
  }

  try {
    const supabase = await createClient();
    console.log("[registerAction] Calling supabase.auth.signUp...");

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.fullName,
          role: "patient",
        },
      },
    });

    if (error) {
      const errorMsg = error.message || error.name || JSON.stringify(error) || "Registration failed";
      console.error("[registerAction] Supabase signUp returned error:", {
        message: error.message,
        status: error.status,
        name: error.name,
        code: (error as any)?.code,
        rawJSON: JSON.stringify(error),
      });
      return { error: errorMsg };
    }

    console.log("[registerAction] Supabase signUp response data:", {
      userId: data.user?.id,
      email: data.user?.email,
      identitiesCount: data.user?.identities?.length,
      hasSession: !!data.session,
    });

    // Check if identity already exists (Supabase returns empty identities array if email exists)
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      console.warn("[registerAction] User already exists with this email address.");
      return { error: "An account with this email address already exists. Please log in." };
    }

    if (!data.user) {
      console.error("[registerAction] Neither user nor error was returned by Supabase.");
      return { error: "Could not create user account. Please check your network connection." };
    }

    if (data.user) {
      console.log("[registerAction] Attempting profile upsert in database for user:", data.user.id);
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email: parsed.data.email,
        full_name: parsed.data.fullName,
        role: "patient",
      });

      if (profileError) {
        console.warn("[registerAction] Profile upsert notice:", profileError.message);
      } else {
        console.log("[registerAction] Profile successfully saved in DB.");
      }
    }

    if (data.session) {
      console.log("[registerAction] User auto-logged in with active session. Redirecting to /patient...");
      redirect("/patient");
    }

    console.log("[registerAction] Registration successful (email verification may be required). Redirecting to /login?registered=true...");
    redirect("/login?registered=true");
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("[registerAction] Unhandled exception in registerAction:", err);
    return {
      error: err?.message || String(err) || "An unexpected error occurred during registration.",
    };
  }
}

export async function logoutAction() {
  console.log("[logoutAction] Logging out user...");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
