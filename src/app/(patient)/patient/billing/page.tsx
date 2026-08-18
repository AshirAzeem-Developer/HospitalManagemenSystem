import { Card } from "@/components/ui/card";
import BillingTable from "@/features/billing/component/billing-table";
import { getPatientInvoices } from "@/features/billing/queries";
import { createClient } from "@/lib/supabase/server";

export default async function PatientBillingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const invoices = await getPatientInvoices(user.id);

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Billing & Statements
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View payment history and outstanding invoices.
        </p>
      </div>

      {/* Balance Card */}
      <div className="w-full sm:max-w-sm">
        <Card
          label="Balance Due"
          value="$0.00"
          hint="Wired up in feature update"
        />
      </div>

      {/* Billing Table */}
      <div className="mt-6 w-full min-w-0 max-w-full">
        <BillingTable invoices={invoices} />
      </div>
    </div>
  );
}