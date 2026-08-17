import { Card } from "@/components/ui/card";

export default function AdminBillingPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Billing</h1>
      <p className="mt-1 text-sm text-slate-500">Hospital invoices and financial records.</p>
      <div className="mt-6">
        <Card label="Total Invoices" value="$0.00" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
