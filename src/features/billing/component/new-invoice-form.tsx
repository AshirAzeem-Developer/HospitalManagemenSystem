"use client";

import Input from "@/components/ui/input";
import InvoiceItemsTable, { type InvoiceItem } from "./invoice-items-table";
import InvoiceSummary from "./invoice-summary";
import Button from "@/components/ui/button";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import CustomSelect from "@/components/ui/CustomSelect";

import {
  createInvoiceAction,
  createInvoiceItemAction,
  getInvoiceByIdAction,
  getInvoiceItemsByInvoiceIdAction,
  updateInvoiceAction,
  updateInvoiceItemAction,
  deleteInvoiceItemAction,
  getInvoicePatientsAction,
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

type PatientOption = {
  id: string;
  profile_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function NewInvoiceForm({ editId }: NewInvoiceFormProps) {
  const router = useRouter();

  const isEditMode = Boolean(editId);

  // Invoice states

  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [roundOff, setRoundOff] = useState(false);

  // Patients

  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  const [patientSearch, setPatientSearch] = useState("");

  // Load patients

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoadingPatients(true);

        const data = await getInvoicePatientsAction();

        const formattedPatients: PatientOption[] = (data ?? []).map(
          (patient: any) => ({
            id: patient.id,
            profile_id: patient.profile_id,
            name: patient.name || "Unknown Patient",
            email: patient.email || "",
            phone: patient.phone || "",
            address: patient.address || "—",
          })
        );

        setPatients(formattedPatients);
      } catch (error) {
        console.error("Failed to load invoice patients:", error);

        toast.error("Failed to load patients. Please try again.");
      } finally {
        setLoadingPatients(false);
      }
    };

    loadPatients();
  }, []);

  // Filter patients by name

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handlePatientChange = (patient: PatientOption) => {
    setPatientId(patient.id);

    setPatientName(patient.name);

    setPatientEmail(patient.email);

    setBillingAddress(patient.address);

    setPatientSearch(patient.name);
  };

  // Load invoice in edit mode

  useEffect(() => {
    if (!editId) return;

    const loadInvoice = async () => {
      try {
        const invoice = await getInvoiceByIdAction(editId);

        const invoiceItems = await getInvoiceItemsByInvoiceIdAction(editId);

        if (!invoice) return;

        // Invoice information

        setInvoiceDate(invoice.issued_date || "");

        setDueDate(invoice.due_date || "");

        setPaymentStatus(invoice.status || "");

        setBillingAddress(invoice.notes || "");

        setTax(Number(invoice.tax_percentage || 0));

        setDiscount(Number(invoice.discount || 0));

        if (invoice.patient_id) {
          setPatientId(invoice.patient_id);
        }

        const patient = (invoice as any)?.patients;

        const profile = Array.isArray(patient?.profiles)
          ? patient.profiles[0]
          : patient?.profiles;

        if (profile?.full_name) {
          setPatientName(profile.full_name);

          setPatientSearch(profile.full_name);
        }

        if (patient?.email) {
          setPatientEmail(patient.email);
        }

        if (patient?.stay_address) {
          setBillingAddress(patient.stay_address);
        }

        const formattedItems: InvoiceItem[] = (invoiceItems ?? []).map(
          (item: any) => ({
            id: item.id,

            item_name: item.item_name || "",

            description: item.description || "",

            unit_cost: String(item.unit_cost ?? ""),

            quantity: String(item.quantity ?? "1"),

            amount: String(item.amount ?? ""),
          })
        );

        setItems(formattedItems);
      } catch (error) {
        console.error("Failed to load invoice:", error);

        toast.error("Failed to load invoice. Please try again.");
      }
    };

    loadInvoice();
  }, [editId]);

  // Handle patient data after patients load

  useEffect(() => {
    if (!patientId || patients.length === 0) {
      return;
    }

    const selectedPatient = patients.find(
      (patient) => patient.id === patientId
    );

    if (!selectedPatient) {
      return;
    }

    setPatientName(selectedPatient.name);

    setPatientEmail(selectedPatient.email);

    setPatientSearch(selectedPatient.name);

    if (!billingAddress) {
      setBillingAddress(selectedPatient.address);
    }
  }, [patientId, patients]);

  // Save invoice

  const handleAddNewInvoice = async () => {
    try {
      if (!patientId) {
        toast.error("Please select a patient.");
        return;
      }

      if (!invoiceDate) {
        toast.error("Please select invoice date.");
        return;
      }

      if (!dueDate) {
        toast.error("Please select due date.");
        return;
      }

      if (!paymentStatus) {
        toast.error("Please select payment status.");
        return;
      }

      // Subtotal

      const subtotal = items.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

      // Tax

      const taxAmount = (subtotal * Number(tax || 0)) / 100;

      // Discount

      const discountAmount = (subtotal * Number(discount || 0)) / 100;

      // Final total

      const finalTotal = subtotal + taxAmount - discountAmount;

      const total = roundOff ? Math.round(finalTotal) : finalTotal;

      // Valid items

      const validItems = items.filter(
        (item) => item.item_name && item.item_name.trim() !== ""
      );

      // EDIT INVOICE

      if (isEditMode && editId) {
        await updateInvoiceAction(editId, {
          patient_id: patientId,

          issued_date: invoiceDate,

          due_date: dueDate,

          subtotal,

          tax_percentage: Number(tax || 0),

          discount: Number(discount || 0),

          total,

          status: paymentStatus as
            | "draft"
            | "paid"
            | "partially_paid"
            | "unpaid"
            | "overdue",

          notes: billingAddress || null,
        });

        // Existing items

        const existingItems = await getInvoiceItemsByInvoiceIdAction(editId);

        // Current item IDs

        const currentItemIds = validItems
          .filter((item) => Boolean(item.id))
          .map((item) => item.id);

        // Delete removed items

        for (const existingItem of existingItems) {
          if (!currentItemIds.includes(existingItem.id)) {
            await deleteInvoiceItemAction(existingItem.id);
          }
        }

        // Update / create items

        for (const item of validItems) {
          const itemData = {
            item_name: item.item_name,

            description: item.description || "",

            unit_cost: Number(item.unit_cost || 0),

            quantity: Number(item.quantity || 1),

            amount: Number(item.amount || 0),
          };

          if (item.id) {
            await updateInvoiceItemAction(item.id, itemData);
          } else {
            await createInvoiceItemAction({
              invoice_id: editId,

              item_name: itemData.item_name,

              description: itemData.description,

              unit_cost: itemData.unit_cost,

              quantity: itemData.quantity,

              amount: itemData.amount,
            });
          }
        }

        // Success toast

        toast.success("Invoice updated successfully!");

        router.push("/admin/billing");

        router.refresh();

        return;
      }

      // CREATE NEW INVOICE

      const invoiceData = {
        appointment_id: null,

        patient_id: patientId,

        issued_date: invoiceDate,

        due_date: dueDate,

        subtotal,

        tax_percentage: Number(tax || 0),

        discount: Number(discount || 0),

        total,

        status: paymentStatus as
          | "draft"
          | "paid"
          | "partially_paid"
          | "unpaid"
          | "overdue",

        notes: billingAddress || null,
      };

      const createdInvoice = await createInvoiceAction(invoiceData);

      for (const item of validItems) {
        await createInvoiceItemAction({
          invoice_id: createdInvoice.id,

          item_name: item.item_name,

          description: item.description || "",

          unit_cost: Number(item.unit_cost || 0),

          quantity: Number(item.quantity || 1),

          amount: Number(item.amount || 0),
        });
      }

      // Success toast

      toast.success("Invoice created successfully!");

      router.push("/admin/billing");

      router.refresh();
    } catch (error: any) {
      console.error("Failed to save invoice:", error);

      toast.error(
        error?.message || "Failed to save invoice. Please try again."
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full">
        <Link
          href="/admin/billing"
          className="
            mb-3
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-[#0A1B39]
            hover:text-[#2E37A4]
            sm:text-base
          "
        >
          <ArrowLeft size={18} strokeWidth={2} />

          <span>Invoices</span>
        </Link>

        <h1 className="text-xl font-semibold text-[#0A1B39] sm:text-2xl">
          {isEditMode ? "Edit Invoice" : "New Invoice"}
        </h1>
      </div>

      <div className="w-full rounded-lg border border-[#E7E8EB] bg-white">
        <div
          className="
            grid
            grid-cols-1
            gap-5
            p-4
            text-[#0A1B39]
            sm:grid-cols-2
            sm:gap-6
            sm:p-6
          "
        >
          {/* Patient Search */}

          <div className="relative">
            <Input
              label="Patient Name"
              placeholder={
                loadingPatients
                  ? "Loading patients..."
                  : "Search patient by name"
              }
              value={patientSearch}
              required
              disabled={loadingPatients}
              onChange={(e) => {
                setPatientSearch(e.target.value);

                setPatientId("");

                setPatientEmail("");

                setBillingAddress("");
              }}
            />

            {/* Patient Results */}

            {patientSearch.trim() !== "" &&
              !patientId &&
              filteredPatients.length > 0 && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    z-50
                    mt-1
                    max-h-60
                    overflow-y-auto
                    rounded-lg
                    border
                    border-[#E7E8EB]
                    bg-white
                    shadow-lg
                  "
                >
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handlePatientChange(patient)}
                      className="
                          flex
                          w-full
                          flex-col
                          px-3
                          py-2
                          text-left
                          hover:bg-gray-50
                        "
                    >
                      <span className="text-sm font-medium text-[#0A1B39]">
                        {patient.name}
                      </span>

                      <span className="text-xs text-gray-500">
                        {patient.email || "No email"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

            {/* No patients found */}

            {patientSearch.trim() !== "" &&
              !patientId &&
              !loadingPatients &&
              filteredPatients.length === 0 && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    z-50
                    mt-1
                    rounded-lg
                    border
                    border-[#E7E8EB]
                    bg-white
                    px-3
                    py-3
                    text-sm
                    text-gray-500
                    shadow-lg
                  "
                >
                  No patient found.
                </div>
              )}
          </div>

          {/* Email */}

          <Input
            label="Email"
            placeholder="Patient email will appear automatically"
            value={patientEmail}
            disabled
          />

          {/* Invoice Date */}

          <Input
            label="Invoice Date"
            type="date"
            required
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />

          {/* Due Date */}

          <Input
            label="Due Date"
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* Payment Method */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#0A1B39]">
              Payment Method
            </label>

            <CustomSelect
              options={paymentMethodOptions}
              placeholder="Select"
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>

          {/* Payment Status */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#0A1B39]">
              Payment Status
              <span className="ml-1 text-red-500">*</span>
            </label>

            <CustomSelect
              options={paymentStatusOptions}
              placeholder="Select"
              value={paymentStatus}
              onChange={setPaymentStatus}
            />
          </div>

          {/* Billing Address */}

          <div className="col-span-1 sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#0A1B39]">
              Billing Address
            </label>

            <textarea
              className="
                h-28
                w-full
                resize-none
                rounded-md
                border
                border-[#E7E8EB]
                p-3
                text-[#0A1B39]
                outline-none
                focus:border-[#2E37A4]
              "
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Invoice Items */}

      <div className="w-full overflow-x-auto">
        <InvoiceItemsTable initialItems={items} onItemsChange={setItems} />
      </div>

      {/* Summary */}

      <div className="w-full">
        <InvoiceSummary
          items={items}
          tax={tax}
          setTax={setTax}
          discount={discount}
          setDiscount={setDiscount}
          roundOff={roundOff}
          setRoundOff={setRoundOff}
        />
      </div>

      <div
        className="
          flex
          w-full
          flex-col-reverse
          gap-3
          sm:flex-row
          sm:justify-end
        "
      >
        <Button
          variant="ghost"
          text="Cancel"
          onClick={() => router.push("/admin/billing")}
        />

        <Button
          variant="primary"
          text={isEditMode ? "Save Changes" : "Add New Invoice"}
          onClick={handleAddNewInvoice}
        />
      </div>
    </div>
  );
}
