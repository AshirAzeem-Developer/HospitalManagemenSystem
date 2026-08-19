"use client";

import Input from "@/components/ui/input";
import { Trash2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type InvoiceItem = {
  id?: string;
  item_name: string;
  description: string;
  unit_cost: string;
  quantity: string;
  amount: string;
};

type InvoiceItemsTableProps = {
  initialItems?: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
};

const emptyItem = (): InvoiceItem => ({
  item_name: "",
  description: "",
  unit_cost: "",
  quantity: "1",
  amount: "",
});

export default function InvoiceItemsTable({
  initialItems = [],
  onItemsChange,
}: InvoiceItemsTableProps) {
  const [items, setItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems);
    } else {
      setItems([emptyItem(), emptyItem()]);
    }
  }, [initialItems]);

  useEffect(() => {
    if (items.length > 0) {
      onItemsChange(items);
    }
  }, [items, onItemsChange]);

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        const updatedItem = {
          ...item,
          [field]: value,
        };

        if (field === "unit_cost" || field === "quantity") {
          const unitCost = Number(updatedItem.unit_cost) || 0;
          const quantity = Number(updatedItem.quantity) || 0;

          updatedItem.amount = String(unitCost * quantity);
        }

        return updatedItem;
      })
    );
  };

  const addItem = () => {
    setItems((currentItems) => [...currentItems, emptyItem()]);
  };

  const removeItem = (index: number) => {
    setItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  return (
    <div className="rounded-xl border border-[#E7E8EB] bg-white p-4 sm:p-5 lg:p-6">
      <h2 className="mb-5 text-lg font-semibold text-[#0A1B39]">
        Invoice Items
      </h2>

      {/* Desktop / Tablet Header */}
      <div className="hidden min-w-[850px] grid-cols-12 gap-3 pb-3 text-sm font-semibold text-[#0A1B39] md:grid">
        <div className="col-span-2">Item</div>
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Unit Cost</div>
        <div className="col-span-1">Qty</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-1" />
      </div>

      {/* Items */}
      <div className="space-y-4 md:space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id ?? `new-${index}`}
            className="
              rounded-lg
              border border-[#E7E8EB]
              p-4
              md:grid
              md:min-w-[850px]
              md:grid-cols-12
              md:items-end
              md:gap-3
              md:border-0
              md:p-0
            "
          >
            {/* Mobile labels */}
            <div className="mb-3 md:mb-0 md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#0A1B39] md:hidden">
                Item
              </label>

              <Input
                label=""
                value={item.item_name}
                onChange={(e) =>
                  updateItem(index, "item_name", e.target.value)
                }
              />
            </div>

            <div className="mb-3 md:mb-0 md:col-span-4">
              <label className="mb-1.5 block text-xs font-medium text-[#0A1B39] md:hidden">
                Description
              </label>

              <Input
                label=""
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
              />
            </div>

            <div className="mb-3 md:mb-0 md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#0A1B39] md:hidden">
                Unit Cost
              </label>

              <Input
                label=""
                type="number"
                value={item.unit_cost}
                onChange={(e) =>
                  updateItem(index, "unit_cost", e.target.value)
                }
              />
            </div>

            <div className="mb-3 md:mb-0 md:col-span-1">
              <label className="mb-1.5 block text-xs font-medium text-[#0A1B39] md:hidden">
                Qty
              </label>

              <Input
                label=""
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", e.target.value)
                }
              />
            </div>

            <div className="mb-3 md:mb-0 md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#0A1B39] md:hidden">
                Amount
              </label>

              <Input
                label=""
                type="number"
                value={item.amount}
                disabled
              />
            </div>

            <div className="flex justify-end md:col-span-1 md:justify-center">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-md
                    border border-[#E7E8EB]
                    hover:bg-gray-50
                  "
                  aria-label="Remove item"
                >
                  <Trash2 size={15} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="
          mt-5
          flex items-center gap-2
          text-sm font-medium
          text-[#2E37A4]
          hover:opacity-80
        "
      >
        <PlusCircle size={16} />
        Add new
      </button>
    </div>
  );
}
