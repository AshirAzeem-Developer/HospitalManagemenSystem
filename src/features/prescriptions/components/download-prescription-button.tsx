"use client";

import { FiDownload } from "react-icons/fi";

export default function DownloadPrescriptionButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
    >
      <FiDownload size={16} />
      Download PDF
    </button>
  );
}
