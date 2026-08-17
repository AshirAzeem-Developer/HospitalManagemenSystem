type MyDoctorsCardProps = {
  doctors?: any[];
};

export default function MyDoctorsCard({
  doctors = [],
}: MyDoctorsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        My Doctors
      </h2>

      <div className="space-y-4">
        {doctors.length === 0 && (
          <p className="text-sm text-slate-500">No doctors found.</p>
        )}

        {doctors.slice(0, 4).map((doctor: any) => (
          <div
            key={doctor.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
                {doctor.profile?.avatar_url ? (
                  <img
                    src={doctor.profile.avatar_url}
                    alt={doctor.profile?.full_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                    {doctor.profile?.full_name?.charAt(0)?.toUpperCase() ||
                      "D"}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {doctor.profile?.full_name || "Unknown"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {doctor.specialization || "General"}
                </p>
              </div>
            </div>

            {/* TODO: no bookings-count field exists yet on the doctor
                record — wire this up once available. */}
            <span className="shrink-0 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
              {doctor.bookings_count ?? 0} Bookings
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}