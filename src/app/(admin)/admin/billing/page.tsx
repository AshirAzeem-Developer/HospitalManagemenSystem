import Button from "@/components/ui/button";
import { getInvoicesAction } from "@/features/billing/actions";
import BillingTable from "@/features/billing/component/billing-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BillingPage() {
  const invoices = await getInvoicesAction();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {/* Left Side */}
        <div>
          <Link
            href="/admin/billing"
            className="mb-3 inline-flex items-center gap-2 text-base font-medium text-gray-600 hover:text-[#2E37A4]"
          >
            <ArrowLeft size={18} strokeWidth={2} />
            <span>Invoices</span>
          </Link>
        <div className="flex gap-2">
          <h1 className="text-2xl font-semibold text-[#0A1B39]">
            Invoices
          </h1>
          <span className="rounded-md border border-[#2E37A4] bg-[#EEF2FF] px-3 py-1.5 text-sm font-medium text-[#2E37A4]">
            Total Invoices: {invoices.length}
          </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <Button
            variant="ghost"
            text="Export"
          />

          <Link href="/admin/billing/new">
            <Button
              variant="primary"
              text="+ New Invoice"
            />
          </Link>
        </div>
      </div>

      {/* Invoice Table */}
      <BillingTable invoices={invoices} />
    </div>
  );
}
