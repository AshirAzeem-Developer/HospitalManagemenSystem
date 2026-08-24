import {
  getInvoiceByIdAction,
  getInvoiceItemsByInvoiceIdAction,
  getPaymentsByInvoiceIdAction,
} from "@/features/billing/actions";

import InvoiceDetail from "@/features/billing/component/invoice-detail";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PatientInvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [invoice, items, payments] = await Promise.all([
    getInvoiceByIdAction(id),
    getInvoiceItemsByInvoiceIdAction(id),
    getPaymentsByInvoiceIdAction(id),
  ]);

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <InvoiceDetail
        invoice={invoice}
        items={items}
        payments={payments}
        isPatient={true}
      />
    </div>
  );
}
