import Table from "@/components/ui/table";

const columns = [
    { key: "pateint", label: "Patient" },
    { key: "phone", label: "Phone" },
    { key: "doctor", label: "Doctor" },
    { key: "Address", label: "Address" },
    { key: "last_visit", label: "Last Visit" },
    { key: "status", label: "Status" },
];


const data = [
  {
    id: 1,
    pateint: "Raza",
    phone: "03325672",
    doctor: "Dr Ahmed",
    Address: "Miami, Florida",
    last_visit: "30 Apr 2025",
    status: "Pending",
  },
];

export default function PatientPage() {
  return (
    <div className="p-6">
      <Table columns={columns} data={data} />
    </div>
  );
}