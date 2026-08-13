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

        if (
          field === "unit_cost" ||
          field === "quantity"
        ) {
          const unitCost =
            Number(updatedItem.unit_cost) || 0;

          const quantity =
            Number(updatedItem.quantity) || 0;

          updatedItem.amount = String(
            unitCost * quantity
          );
        }

        return updatedItem;
      })
    );
  };

  const addItem = () => {
    setItems((currentItems) => [
      ...currentItems,
      emptyItem(),
    ]);
  };

  const removeItem = (index: number) => {
    setItems((currentItems) =>
      currentItems.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  return (
    <div className="rounded-xl border border-[#E7E8EB] bg-white p-6">
      <h2 className="mb-5 text-lg font-semibold text-[#0A1B39]">
        Invoice Items
      </h2>

      <div className="grid grid-cols-12 gap-3 pb-3 text-sm font-semibold text-[#0A1B39]">
        <div className="col-span-2">Item</div>
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Unit Cost</div>
        <div className="col-span-1">Qty</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-1" />
      </div>

      {items.map((item, index) => (
        <div
          key={item.id ?? `new-${index}`}
          className="mt-3 grid grid-cols-12 items-end gap-3"
        >
          <div className="col-span-2">
            <Input
              label=""
              value={item.item_name}
              onChange={(e) =>
                updateItem(
                  index,
                  "item_name",
                  e.target.value
                )
              }
            />
          </div>

          <div className="col-span-4">
            <Input
              label=""
              value={item.description}
              onChange={(e) =>
                updateItem(
                  index,
                  "description",
                  e.target.value
                )
              }
            />
          </div>

          <div className="col-span-2">
            <Input
              label=""
              type="number"
              value={item.unit_cost}
              onChange={(e) =>
                updateItem(
                  index,
                  "unit_cost",
                  e.target.value
                )
              }
            />
          </div>

          <div className="col-span-1">
            <Input
              label=""
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateItem(
                  index,
                  "quantity",
                  e.target.value
                )
              }
            />
          </div>

          <div className="col-span-2">
            <Input
              label=""
              type="number"
              value={item.amount}
              disabled
            />
          </div>

          <div className="col-span-1 flex justify-center">
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E7E8EB] hover:bg-gray-50"
              >
                <Trash2
                  size={15}
                  className="text-gray-500"
                />
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="mt-5 flex items-center gap-2 text-sm font-medium text-[#2E37A4]"
      >
        <PlusCircle size={16} />
        Add new
      </button>
    </div>
  );
}