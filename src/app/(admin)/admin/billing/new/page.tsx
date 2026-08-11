import { Card } from "@/components/ui/card";

export default function NewBillingPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">New Billing</h1>
      <p className="mt-1 text-sm text-slate-500">
        Create a new invoice or payment entry here.
      </p>
      <div className="mt-6">
        <Card label="Action" value="Create" hint="Feature wiring in progress" />
      </div>
    </div>
  );
}
