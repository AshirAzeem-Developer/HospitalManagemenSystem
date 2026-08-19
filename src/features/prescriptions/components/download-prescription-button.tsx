"use client";

import { FiDownload } from "react-icons/fi";

export default function DownloadPrescriptionButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--hover)] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
    >
      <FiDownload size={16} />
      Download PDF
    </button>
  );
}
