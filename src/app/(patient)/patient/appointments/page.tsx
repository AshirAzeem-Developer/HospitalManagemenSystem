import { Card } from "@/components/ui/card";

export default function PatientAppointmentsPage() {
  return (
    <div>
<h1 className="text-xl font-semibold text-slate-900 dark:text-white">My Appointments</h1>   
   <p className="mt-1 text-sm text-slate-500">Book and view your upcoming medical appointments.</p>
      <div className="mt-6">
        <Card label="Upcoming Visits" value="0" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
