"use client";

import Input from "@/components/ui/input";
import CustomSelect from "@/components/ui/CustomSelect";
import InvoiceItemsTable, {
  type InvoiceItem,
} from "./invoice-items-table";
import InvoiceSummary from "./invoice-summary";
import Button from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  createInvoiceAction,
  createInvoiceItemAction,
  getInvoiceByIdAction,
  getInvoiceItemsByInvoiceIdAction,
  updateInvoiceAction,
  updateInvoiceItemAction,
  deleteInvoiceItemAction,
} from "../actions";

const paymentMethodOptions = [
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
];

const paymentStatusOptions = [
  { label: "Paid", value: "paid" },
  { label: "Partially Paid", value: "partially_paid" },
  { label: "Unpaid", value: "unpaid" },
];

type NewInvoiceFormProps = {
  editId?: string;
};

export default function NewInvoiceForm({
  editId,
}: NewInvoiceFormProps) {
  const router = useRouter();

  const isEditMode = Boolean(editId);

  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [patientName, setPatientName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [roundOff, setRoundOff] = useState(false);

  useEffect(() => {
    if (!editId) {
      return;
    }

    const loadInvoice = async () => {
      try {
        const invoice = await getInvoiceByIdAction(editId);
        const invoiceItems =
          await getInvoiceItemsByInvoiceIdAction(editId);

        if (!invoice) {
          return;
        }

        setInvoiceDate(invoice.issued_date || "");
        setDueDate(invoice.due_date || "");

        setPaymentStatus(invoice.status || "");

        setBillingAddress(invoice.notes || "");

        setTax(Number(invoice.tax_percentage || 0));
        setDiscount(Number(invoice.discount || 0));

        setPatientName(
          invoice?.patients?.profiles?.full_name || ""
        );

        const formattedItems: InvoiceItem[] =
          invoiceItems.map((item) => ({
            id: item.id,
            item_name: item.item_name || "",
            description: item.description || "",
            unit_cost: String(item.unit_cost ?? ""),
            quantity: String(item.quantity ?? "1"),
            amount: String(item.amount ?? ""),
          }));

        setItems(formattedItems);
      } catch (error) {
        console.error("Failed to load invoice:", error);
      }
    };

    loadInvoice();
  }, [editId]);

  /*
   * SAVE / UPDATE
   */
  const handleAddNewInvoice = async () => {
    const subtotal = items.reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );

    const taxAmount = (subtotal * tax) / 100;

    const discountAmount =
      (subtotal * discount) / 100;

    const finalTotal =
      subtotal + taxAmount - discountAmount;

    const total = roundOff
      ? Math.round(finalTotal)
      : finalTotal;

    const validItems = items.filter(
      (item) =>
        item.item_name.trim() !== ""
    );


    if (isEditMode && editId) {
      /*
       * Invoice update
       */
      await updateInvoiceAction(editId, {
        issued_date: invoiceDate,
        due_date: dueDate,
        subtotal,
        tax_percentage: tax,
        discount,
        total,
        status: paymentStatus as
          | "draft"
          | "paid"
          | "partially_paid"
          | "unpaid"
          | "overdue",
        notes: billingAddress || null,
      });

      
      const existingItems =
        await getInvoiceItemsByInvoiceIdAction(
          editId
        );

     
      const currentItemIds = validItems
        .filter((item) => item.id)
        .map((item) => item.id);

     
      for (const existingItem of existingItems) {
        if (
          !currentItemIds.includes(
            existingItem.id
          )
        ) {
          await deleteInvoiceItemAction(
            existingItem.id
          );
        }
      }

     
      for (const item of validItems) {
        const itemData = {
          item_name: item.item_name,
          description:
            item.description || "",
          unit_cost: Number(
            item.unit_cost || 0
          ),
          quantity: Number(
            item.quantity || 1
          ),
          amount: Number(
            item.amount || 0
          ),
        };

       
        if (item.id) {
          await updateInvoiceItemAction(
            item.id,
            itemData
          );
        }

       
        else {
          await createInvoiceItemAction({
            invoice_id: editId,
            item_name: itemData.item_name,
            description:
              itemData.description || "",
            unit_cost:
              itemData.unit_cost,
            quantity:
              itemData.quantity,
            amount:
              itemData.amount,
          });
        }
      }

  
      router.push("/admin/billing");
      router.refresh();

      return;
    }


    const invoiceData = {
      appointment_id: null,
      patient_id:
        "33333333-3333-3333-3333-333333333301",
      issued_date: invoiceDate,
      due_date: dueDate,
      subtotal,
      tax_percentage: tax,
      discount,
      total,
      status: paymentStatus as
        | "draft"
        | "paid"
        | "partially_paid"
        | "unpaid"
        | "overdue",
      notes: billingAddress || null,
    };

    console.log(invoiceData);

    const createdInvoice =
      await createInvoiceAction(
        invoiceData
      );

    for (const item of validItems) {
      await createInvoiceItemAction({
        invoice_id: createdInvoice.id,
        item_name: item.item_name,
        description: item.description,
        unit_cost: Number(
          item.unit_cost || 0
        ),
        quantity: Number(
          item.quantity || 1
        ),
        amount: Number(
          item.amount || 0
        ),
      });
    }

    router.push("/admin/billing");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
      <Link
            href="/admin/billing"
            className="mb-3 inline-flex items-center gap-2 text-base font-medium text-gray-600 hover:text-[#2E37A4]"
          >
            <ArrowLeft size={18} strokeWidth={2} />
            <span>Invoices</span>
          </Link>
        <h1 className="text-2xl font-semibold text-[#0A1B39]">
          {isEditMode
            ? "Edit Invoice"
            : "New Invoice"}
        </h1>
      </div>

      {/* Invoice Information */}

      <div className="rounded-lg border border-[#E7E8EB] bg-white">
        <div className="grid grid-cols-2 gap-6 p-6 text-[#0A1B39]">
          <Input
            label="Patient Name"
            required
            value={patientName}
            onChange={(e) =>
              setPatientName(e.target.value)
            }
          />

          <Input
            label="Email"
            placeholder="Patient email will appear automatically"
            disabled
          />

          <Input
            label="Invoice Date"
            type="date"
            required
            value={invoiceDate}
            onChange={(e) =>
              setInvoiceDate(e.target.value)
            }
          />

          <Input
            label="Due Date"
            type="date"
            required
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Payment Method
            </label>

            <CustomSelect
              options={paymentMethodOptions}
              placeholder="Select"
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Payment Status
            </label>

            <CustomSelect
              options={paymentStatusOptions}
              placeholder="Select"
              value={paymentStatus}
              onChange={setPaymentStatus}
            />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Billing Address
            </label>

            <textarea
              className="h-28 w-full rounded-md border border-[#E7E8EB] p-3 outline-none"
              value={billingAddress}
              onChange={(e) =>
                setBillingAddress(
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Invoice Items */}

      <InvoiceItemsTable
        initialItems={items}
        onItemsChange={setItems}
      />

      {/* Summary */}

      <InvoiceSummary
        items={items}
        tax={tax}
        setTax={setTax}
        discount={discount}
        setDiscount={setDiscount}
        roundOff={roundOff}
        setRoundOff={setRoundOff}
      />

      {/* Buttons */}

      <div className="flex justify-end gap-3">
        <Button
          variant="ghost"
          text="Cancel"
          onClick={() =>
            router.push("/admin/billing")
          }
        />

        <Button
          variant="primary"
          text={
            isEditMode
              ? "Save Changes"
              : "Add New Invoice"
          }
          onClick={handleAddNewInvoice}
        />
      </div>
    </div>
  );
}