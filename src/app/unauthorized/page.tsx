import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Access denied</h1>
      <p className="text-sm text-slate-500">
        You don't have permission to view this page.
      </p>
      <Link
        href="/login"
        className="text-sm font-medium text-teal-600 hover:underline"
      >
        Back to login
      </Link>
    </div>
  );
}
