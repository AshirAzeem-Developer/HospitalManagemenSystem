"use client";

import type { InvoiceItem } from "./invoice-items-table";

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
      <div
        className="
          w-full
          rounded-xl
          border
          border-border
          bg-background
          p-4
          sm:p-5
          lg:p-6
        "
      >
        {/* Summary */}
        <div className="flex justify-end">
          <div
            className="
              w-full
              max-w-[420px]
              space-y-4
            "
          >
            {/* Amount */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <span className="text-sm text-foreground">Amount</span>

              <span className="font-medium text-foreground">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Tax */}
            <div
              className="
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:gap-3
                ml-[20px]
              "
            >
              <span className="text-sm text-foreground">Tax</span>

              <div
                className="
                  flex
                  w-full
                  max-w-[140px]
                  overflow-hidden
                  rounded-md
                  border
                  border-border
                  bg-background
                "
              >
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="
                    w-full
                    min-w-0
                    border-none
                    bg-transparent
                    px-3
                    py-2
                    text-sm
                    text-foreground
                    outline-none
                    placeholder:text-muted
                  "
                />

                <div
                  className="
                    flex
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    border-l
                    border-border
                    text-sm
                    text-muted
                  "
                >
                  %
                </div>
              </div>

              <span className="font-medium text-foreground">
                ${taxAmount.toFixed(2)}
              </span>
            </div>

            {/* Discount */}
            <div
              className="
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:gap-3
              "
            >
              <span className="text-sm text-foreground">Discount</span>

              <div
                className="
                  flex
                  w-full
                  max-w-[140px]
                  overflow-hidden
                  rounded-md
                  border
                  border-border
                  bg-background
                "
              >
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="
                    w-full
                    min-w-0
                    border-none
                    bg-transparent
                    px-3
                    py-2
                    text-sm
                    text-foreground
                    outline-none
                    placeholder:text-muted
                  "
                />

                <div
                  className="
                    flex
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    border-l
                    border-border
                    text-sm
                    text-muted
                  "
                >
                  %
                </div>
              </div>

              <span className="font-medium text-foreground">
                -${discountAmount.toFixed(2)}
              </span>
            </div>

            {/* Round Off */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRoundOff(!roundOff)}
                  aria-label="Toggle round off"
                  aria-pressed={roundOff}
                  className={`
                    relative
                    h-5
                    w-9
                    shrink-0
                    rounded-full
                    transition-colors
                    ${
                      roundOff
                        ? "bg-[#2E37A4]"
                        : "bg-slate-300 dark:bg-slate-700"
                    }
                  `}
                >
                  <span
                    className={`
                      absolute
                      top-0.5
                      h-4
                      w-4
                      rounded-full
                      bg-white
                      shadow
                      transition-all
                      ${roundOff ? "left-4" : "left-0.5"}
                    `}
                  />
                </button>

                <span className="text-sm text-foreground">Round Off Total</span>
              </div>

              <span className="font-medium text-foreground">
                ${roundedTotal.toFixed(2)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Total */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <span
                className="
                  text-base
                  font-semibold
                  text-foreground
                  sm:text-[18px]
                "
              >
                Total (USD)
              </span>

              <span
                className="
                  text-base
                  font-bold
                  text-foreground
                  sm:text-[18px]
                "
              >
                ${roundedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Other Information */}
        <div className="mt-8 sm:mt-10">
          <label
            className="
              mb-2
              block
              text-sm
              font-bold
              text-foreground
            "
          >
            Other Information
          </label>

          <textarea
            className="
              h-28
              w-full
              resize-y
              rounded-md
              border
              border-border
              bg-background
              p-3
              text-sm
              text-foreground
              outline-none
              transition-colors
              placeholder:text-muted
              focus:border-[#2E37A4]
              focus:ring-1
              focus:ring-[#2E37A4]
              sm:h-32
            "
          />
        </div>
      </div>
    </div>
  );
}
