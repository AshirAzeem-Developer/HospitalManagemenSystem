import { Card } from "@/components/ui/card";

export default function AdminBillingDetailPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Billing Details</h1>
      <p className="mt-1 text-sm text-slate-500">
        Invoice details will be shown here.
      </p>
      <div className="mt-6">
        <Card
          label="Invoice Status"
          value="Pending"
          hint="Feature wiring in progress"
        />
      </div>
    </div>
  );
}
