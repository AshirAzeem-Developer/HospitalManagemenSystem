"use client";

import { InvoiceItem } from "./invoice-items-table";

export default function InvoiceSummary({
  items,
  tax,
  setTax,
  discount,
  setDiscount,
  roundOff,
  setRoundOff,
}: {
  items: InvoiceItem[];
  tax: number;
  setTax: (value: number) => void;
  discount: number;
  setDiscount: (value: number) => void;
  roundOff: boolean;
  setRoundOff: (value: boolean) => void;
}) {
  const totalAmount = items.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const taxAmount = (totalAmount * tax) / 100;
  const discountAmount = (totalAmount * discount) / 100;

  const finalTotal = totalAmount + taxAmount - discountAmount;

  const roundedTotal = roundOff ? Math.round(finalTotal) : finalTotal;

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <div className="w-full max-w-[420px] space-y-4">
          {/* Amount */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#0A1B39]">
              Amount
            </span>

            <span className="font-medium text-[#0A1B39]">
              ${totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Tax */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <span className="text-sm text-[#0A1B39]">
              Tax
            </span>

            <div className="flex w-full max-w-[140px] overflow-hidden rounded-md border border-[#E7E8EB]">
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                className="
                  w-full
                  border-none
                  px-3 py-2
                  text-sm
                  text-[#0A1B39]
                  outline-none
                "
              />

              <div className="flex w-10 shrink-0 items-center justify-center border-l border-[#E7E8EB] text-sm text-[#0A1B39]">
                %
              </div>
            </div>

            <span className="font-medium text-[#0A1B39]">
              ${taxAmount.toFixed(2)}
            </span>
          </div>

          {/* Discount */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <span className="text-sm text-[#0A1B39]">
              Discount
            </span>

            <div className="flex w-full max-w-[140px] overflow-hidden rounded-md border border-[#E7E8EB]">
              <input
                type="number"
                value={discount}
                onChange={(e) =>
                  setDiscount(Number(e.target.value))
                }
                className="
                  w-full
                  border-none
                  px-3 py-2
                  text-sm
                  text-[#0A1B39]
                  outline-none
                "
              />

              <div className="flex w-10 shrink-0 items-center justify-center border-l border-[#E7E8EB] text-sm text-[#0A1B39]">
                %
              </div>
            </div>

            <span className="font-medium text-[#0A1B39]">
              -${discountAmount.toFixed(2)}
            </span>
          </div>

          {/* Round Off */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRoundOff(!roundOff)}
                className={`relative h-5 w-9 shrink-0 rounded-full ${
                  roundOff ? "bg-[#2E37A4]" : "bg-[#E5E7EB]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                    roundOff ? "left-4" : "left-0.5"
                  }`}
                />
              </button>

              <span className="text-sm text-[#0A1B39]">
                Round Off Total
              </span>
            </div>

            <span className="font-medium text-[#0A1B39]">
              ${roundedTotal.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-[#E7E8EB]" />

          {/* Total */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-semibold text-[#0A1B39] sm:text-[18px]">
              Total (USD)
            </span>

            <span className="text-base font-bold text-[#0A1B39] sm:text-[18px]">
              ${roundedTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Other Information */}
      <div className="mt-8 sm:mt-10">
        <label className="mb-2 block text-sm font-bold text-[#0A1B39]">
          Other Information
        </label>

        <textarea
          className="
            h-28
            w-full
            resize-none
            rounded-md
            border border-[#E7E8EB]
            p-3
            text-[#0A1B39]
            outline-none
            focus:border-[#2E37A4]
            sm:h-32
          "
        />
      </div>
    </div>
  );
}
