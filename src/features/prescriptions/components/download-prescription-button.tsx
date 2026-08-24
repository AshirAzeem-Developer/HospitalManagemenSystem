"use client";

import { FiDownload } from "react-icons/fi";

export default function DownloadPrescriptionButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--hover)] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 sm:w-auto sm:px-4"
    >
      <FiDownload size={16} />
      Download PDF
    </button>
  );
}
