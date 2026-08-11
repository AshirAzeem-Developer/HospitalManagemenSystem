import { Card } from "@/components/ui/card";

export default function AdminBillingTransactionsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Transactions</h1>
      <p className="mt-1 text-sm text-slate-500">
        Transaction records will appear here.
      </p>
      <div className="mt-6">
        <Card
          label="Transaction Count"
          value="0"
          hint="Feature wiring in progress"
        />
      </div>
    </div>
  );
}
