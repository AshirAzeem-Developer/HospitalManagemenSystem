import { Card } from "@/components/ui/card";

export default function AdminBillingPaymentsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Payments</h1>
      <p className="mt-1 text-sm text-slate-500">
        Payment history will appear here.
      </p>
      <div className="mt-6">
        <Card
          label="Payment Count"
          value="0"
          hint="Feature wiring in progress"
        />
      </div>
    </div>
  );
}
