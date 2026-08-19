import Button from "@/components/ui/button";
import { getInvoicesAction } from "@/features/billing/actions";
import BillingTable from "@/features/billing/component/billing-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BillingPage() {
  const invoices = await getInvoicesAction();

  return (
    <div className="w-full text-[#0A1B39]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
  href="/admin/billing"
  className="mb-3 inline-flex items-center gap-2 text-base font-medium text-[#0A1B39] dark:text-white hover:text-[#2E37A4]"
>
  <ArrowLeft size={18} strokeWidth={2} />
  <span>Invoices</span>
</Link>

          <div className="flex flex-wrap items-center gap-2">
<h1 className="text-2xl font-semibold text-[#0A1B39] dark:text-white">
  Invoices
</h1>
            <span className="rounded-md border border-[#2E37A4] bg-[#EEF2FF] px-3 py-1.5 text-sm font-medium text-[#2E37A4]">
              Total Invoices: {invoices.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Hospital invoices and financial records.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button variant="ghost" text="Export" />

          <Link href="/admin/billing/new" className="w-full sm:w-auto">
            <Button variant="primary" text="+ New Invoice" />
          </Link>
        </div>
      </div>

      {/* Invoice Table */}
      <BillingTable invoices={invoices} />
    </div>
  );
}