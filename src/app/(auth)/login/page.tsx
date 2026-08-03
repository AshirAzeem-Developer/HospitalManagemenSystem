import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Log in</h1>
      <p className="mt-1 text-sm text-slate-500">
        Welcome back to Hospital MS.
      </p>

      {params.registered && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Account created. Please log in.
        </p>
      )}

      <div className="mt-6">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-teal-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
