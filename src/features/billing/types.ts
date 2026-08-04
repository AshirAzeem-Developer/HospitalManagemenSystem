// type.ts => defines TypeScript interfaces and types for the Billing module.
export interface Invoice {
    id : string,
    appointment_id : string | null,
    patient_id : string,
    issued_date : string,
    due_date : string,
    subtotal : number,
    tax_percentage : number,
    discount : number,
    total : number,
    status : "draft" | "paid" | "partially_paid" | "unpaid" | "overdue",
    notes : string | null,
}
export type NewInvoice = Omit<Invoice,"id">;

export interface InvoiceItems {
    id : string,
    invoice_id : string,
    item_name : string,
    description: string,
    unit_cost: number,
    quantity: number,
    amount: number,
}
export type NewInvoiceItems = Omit<InvoiceItems,"id">;

export interface Payment {
    id : string,
    invoice_id : string,
    amount_paid : number,
    payment_date : string,
    payment_method : "cash" | "card" | "online_transfer",
    payment_status : "success" | "pending" | "failed",
    reference_number : string,
}
export type NewPayment = Omit<Payment,"id">;