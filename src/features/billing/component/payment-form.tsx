"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";

import { createPaymentAction } from "../actions";

type PaymentFormProps = {
  invoiceId: string;
  invoiceTotal: number;
  paidAmount: number;
};

const paymentMethodOptions = [
  {
    label: "Cash",
    value: "cash",
  },
  {
    label: "Card",
    value: "card",
  },
];

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function PaymentForm({
  invoiceId,
  invoiceTotal,
  paidAmount,
}: PaymentFormProps) {
  const router = useRouter();

  const safeInvoiceTotal = Number(invoiceTotal) || 0;
  const safePaidAmount = Number(paidAmount) || 0;

  const remainingAmount = Math.max(0, safeInvoiceTotal - safePaidAmount);

  const [amount, setAmount] = useState(
    remainingAmount > 0 ? remainingAmount.toFixed(2) : ""
  );

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState(getTodayDate());
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    try {
      const paymentAmount = Number(amount);

      if (!amount || !Number.isFinite(paymentAmount)) {
        toast.error("Please enter a valid payment amount.");
        return;
      }

      if (paymentAmount <= 0) {
        toast.error("Payment amount must be greater than 0.");
        return;
      }

      if (paymentAmount > remainingAmount) {
        toast.error(
          `Payment cannot be greater than remaining amount $${remainingAmount.toFixed(
            2
          )}.`
        );
        return;
      }

      if (!paymentMethod) {
        toast.error("Please select payment method.");
        return;
      }

      if (!paymentDate) {
        toast.error("Please select payment date.");
        return;
      }

      setLoading(true);

      await createPaymentAction({
        invoice_id: invoiceId,
        amount_paid: paymentAmount,
        payment_date: paymentDate,
        payment_method: paymentMethod as "cash" | "card",
        payment_status: "success",
        reference_number: referenceNumber.trim() || null,
      });

      toast.success("Payment added successfully.");

      setAmount("");
      setPaymentMethod("");
      setPaymentDate(getTodayDate());
      setReferenceNumber("");

      router.refresh();
    } catch (error: unknown) {
      console.error("PAYMENT FORM ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Failed to add payment.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (remainingAmount <= 0) {
    return (
      <div
        className="
          rounded-lg
          border
          border-green-200
          bg-green-50
          p-4
          dark:border-green-800
          dark:bg-green-950/30
        "
      >
        <p
          className="
            text-sm
            font-medium
            text-green-700
            dark:text-green-400
          "
        >
          This invoice is fully paid.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        rounded-lg
        border
        border-[#E7E8EB]
        bg-white
        p-4
        shadow-sm
        dark:border-slate-700
        dark:bg-slate-900
        sm:p-5
      "
    >
      {/* HEADER */}
      <div className="mb-5">
        <h3
          className="
            text-base
            font-semibold
            text-[#0A1B39]
            dark:text-white
          "
        >
          Add Payment
        </h3>

        <p
          className="
            mt-1
            text-xs
            text-gray-500
            dark:text-slate-400
          "
        >
          Record a payment for this invoice.
        </p>
      </div>

      {/* PAYMENT SUMMARY */}
      <div
        className="
          mb-5
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-3
        "
      >
        {/* INVOICE TOTAL */}
        <div
          className="
            rounded-md
            bg-gray-50
            p-3
            dark:bg-slate-800
          "
        >
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Invoice Total
          </p>

          <p
            className="
              mt-1
              text-base
              font-semibold
              text-[#0A1B39]
              dark:text-white
            "
          >
            ${safeInvoiceTotal.toFixed(2)}
          </p>
        </div>

        {/* PAID */}
        <div
          className="
            rounded-md
            bg-green-50
            p-3
            dark:bg-green-950/20
          "
        >
          <p className="text-xs text-gray-500 dark:text-slate-400">Paid</p>

          <p
            className="
              mt-1
              text-base
              font-semibold
              text-green-600
              dark:text-green-400
            "
          >
            ${safePaidAmount.toFixed(2)}
          </p>
        </div>

        {/* REMAINING */}
        <div
          className="
            rounded-md
            bg-red-50
            p-3
            dark:bg-red-950/20
          "
        >
          <p className="text-xs text-gray-500 dark:text-slate-400">Remaining</p>

          <p
            className="
              mt-1
              text-base
              font-semibold
              text-red-600
              dark:text-red-400
            "
          >
            ${remainingAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* FORM */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
        "
      >
        {/* AMOUNT */}
        <Input
          label="Payment Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        {/* DATE */}
        <Input
          label="Payment Date"
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />

        {/* METHOD */}
        <div className="min-w-0">
          <label
            className="
              mb-2
              block
              text-sm
              font-medium
              text-foreground
            "
          >
            Payment Method
            <span className="ml-1 text-red-500">*</span>
          </label>

          <CustomSelect
            options={paymentMethodOptions}
            placeholder="Select payment method"
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        {/* REFERENCE */}
        <Input
          label="Reference Number"
          placeholder="Optional"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
        />
      </div>

      {/* SUBMIT */}
      <div className="mt-5 flex justify-end">
        <Button
          variant="primary"
          text={loading ? "Adding Payment..." : "Add Payment"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
}
