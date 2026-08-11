import {
  getInvoiceByIdAction,
  getInvoiceItemsByInvoiceIdAction,
  getPaymentsByInvoiceIdAction,
} from "@/features/billing/actions";

import { notFound } from "next/navigation";

import InvoiceDetail from "@/features/billing/component/invoice-detail";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { id } = await params;

  const invoice = await getInvoiceByIdAction(id);

  if (!invoice) {
    notFound();
  }

  const items =
    await getInvoiceItemsByInvoiceIdAction(id);

  const payments =
    await getPaymentsByInvoiceIdAction(id);

  return (
    <InvoiceDetail
      invoice={invoice}
      items={items}
      payments={payments}
    />
  );
}