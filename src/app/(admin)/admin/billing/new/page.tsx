import NewInvoiceForm from "@/features/billing/component/new-invoice-form";

type PageProps = {
  searchParams: Promise<{
    edit?: string;
  }>;
};

export default async function NewInvoicePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return <NewInvoiceForm editId={params.edit} />;
}