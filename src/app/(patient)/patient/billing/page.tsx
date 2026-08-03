import { Card } from "@/components/ui/card";

export default function PatientBillingPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Billing & Statements</h1>
      <p className="mt-1 text-sm text-slate-500">View payment history and outstanding invoices.</p>
      <div className="mt-6">
        <Card label="Balance Due" value="$0.00" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
