import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Create an account
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Sign up as a patient to book appointments.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-teal-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
