import Button from "@/components/ui/button";
import { getPaymentsAction } from "@/features/billing/actions";
import PaymentsTable from "@/features/billing/component/payments-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PaymentsPage() {
  const payments = await getPaymentsAction();

  return (
    <div>

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <Link
            href="/admin"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E7E8EB] bg-white text-gray-500 transition hover:bg-gray-50 hover:text-[#2E37A4]"
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="flex items-center gap-2">

            <h1 className="text-[20px] font-semibold text-[#0A1B39]">
              Payments
            </h1>

            <span className="rounded border border-[#2E37A4] bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-medium text-[#2E37A4]">
              Total Payments : {payments.length}
            </span>

          </div>
        </div>

        {/* <div className="flex items-center gap-2">

          <Button
            variant="ghost"
            text="Export"
          />

          <Link href="/admin/payments/new">
            <Button
              variant="primary"
              text="+ New Payment"
            />
          </Link>

        </div> */}
      </div>

      {/* TABLE */}

      <PaymentsTable payments={payments} />

      <div className="mt-4 border-t border-[#E7E8EB] pt-2 text-center">
        <p className="text-[10px] text-gray-400">
          2025 © Preclinic, All Rights Reserved
        </p>
      </div>

    </div>
  );
}