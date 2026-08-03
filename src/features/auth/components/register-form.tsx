"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../schema";
import { registerAction } from "../actions";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    console.log("[RegisterForm] Submitting values:", {
      fullName: values.fullName,
      email: values.email,
    });

    try {
      const result = await registerAction(values);
      console.log("[RegisterForm] registerAction return result:", result);
      if (result?.error) {
        setServerError(result.error);
      }
    } catch (err) {
      console.error("[RegisterForm] Error executing registerAction:", err);
      setServerError("An unexpected error occurred during registration.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <input
          type="text"
          {...register("fullName")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-black focus:border-teal-500 focus:outline-none"
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-black focus:border-teal-500 focus:outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-black focus:border-teal-500 focus:outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Confirm Password
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-black focus:border-teal-500 focus:outline-none"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
