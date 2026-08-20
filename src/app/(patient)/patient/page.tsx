import { Card } from "@/components/ui/card";
// import Table from "@/components/ui/table";

export default function PatientDashboardPage() {
  return (
    <>
      <div>
<h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          Dashboard
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card
            label="Upcoming Appointment"
            value="—"
            hint="Wired up in Day 4"
          />

          <Card
            label="Recent Bill"
            value="—"
            hint="Wired up in Day 4"
          />
        </div>
      </div>

      {/* 
      <div className="p-6">
        <Table columns={columns} data={data} />
      </div>
      */}
    </>
  );
}