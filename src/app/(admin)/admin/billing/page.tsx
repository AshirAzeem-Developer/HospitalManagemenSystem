import Button from "@/components/ui/button";
import { getInvoicesAction } from "@/features/billing/actions";
import BillingTable from "@/features/billing/component/billing-table";

export default async function BillingPage() {
  const invoices = await getInvoicesAction();

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#0A1B39]">Invoices</h1>

          <span className="rounded-md border border-[#2E37A4] bg-[#EEF2FF] px-3 py-1 text-sm font-medium text-[#2E37A4]">
            Total Invoices: {invoices.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" text="Export" />

          <Button variant="primary" text="+ New Invoice" />
        </div>
      </div>

      <BillingTable invoices={invoices} />
    </div>
  );
}
